import yaml from 'yaml';
import { env } from './config';
import { PortainerApi } from "./portainer/api";
import dotenv from 'dotenv';

dotenv.config();

const portainerApi = new PortainerApi({
  baseURL: env.portainerApiBaseUrl,
});

function parseImage(image: string) {
  const [name, tag] = image.split(':');
  return { name, tag };
};

(async () => {
  const authResponse = await portainerApi.auth.authenticateUser({
    username: env.auth.username,
    password: env.auth.password,
  });

  if (!authResponse.data.jwt) throw new Error('Could not get JWT from the response');

  const stackFileResponse = await portainerApi.stacks.stackFileInspect(env.stack.identifier, {
    headers: {
      Authorization: `Bearer ${authResponse.data.jwt}`,
    }
  });

  if (!stackFileResponse.data.StackFileContent) throw new Error('Stack file is null');
  
  const stackDefinition = yaml.parse(stackFileResponse.data.StackFileContent);
  const image = parseImage(stackDefinition.services[env.stack.service].image);
  stackDefinition.services[env.stack.service].image = `${image.name}:${env.newTag}`;

  const updateStackResponse = await portainerApi.stacks.stackUpdate({
    id: env.stack.identifier,
    endpointId: env.stack.endpointId,
  }, {
    stackFileContent: yaml.stringify(stackDefinition),
  }, {
    headers: {
      Authorization: `Bearer ${authResponse.data.jwt}`,
    }
  });

  console.assert(updateStackResponse.status === 200, 'Could not update stack');
})();
