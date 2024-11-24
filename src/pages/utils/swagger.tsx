import React from 'react';

interface OpenAPISpec {
  openapi: string;
  info: {
    title: string;
    version: string;
    description: string;
  };
  servers: Array<{
    url: string;
    description: string;
  }>;
  paths: {
    [key: string]: {
      [method: string]: {
        tags: string[];
        summary: string;
        description: string;
        responses: {
          [statusCode: string]: {
            description: string;
          };
        };
      };
    };
  };
}

export const apiConfig: OpenAPISpec = {
  openapi: '3.0.0',
  info: {
    title: 'Game Distribution App API',
    version: '1.0.0',
    description: 'Dokumentasi API untuk Game Distribution App',
  },
  servers: [
    {
      url: 'https://game-dist-app.vercel.app/api',
      description: 'Production server',
    },
    {
      url: 'http://localhost:3000/api',
      description: 'Development server',
    },
  ],
  paths: {
    '/auth/google': {
      post: {
        tags: ['Authentication'],
        summary: 'Login dengan Google',
        description: 'Memulai proses autentikasi menggunakan Google OAuth',
        responses: {
          '302': {
            description: 'Redirect ke halaman Google OAuth',
          }
        }
      }
    },
    '/auth/signout': {
      post: {
        tags: ['Authentication'],
        summary: 'Sign Out',
        description: 'Endpoint untuk logout user',
        responses: {
          '200': {
            description: 'Logout berhasil'
          }
        }
      }
    }
  }
};

export const getApiDocs = () => apiConfig;

const SwaggerDocs = () => {
  return (
    <div className="p-6 max-w-4xl mx-auto">
      {/* API Info Section */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h1 className="text-2xl font-bold mb-2">
          {apiConfig.info.title} - v{apiConfig.info.version}
        </h1>
        <p className="text-gray-600">{apiConfig.info.description}</p>
      </div>

      {/* Servers Section */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h2 className="text-xl font-bold mb-4">Servers</h2>
        {apiConfig.servers.map((server, index) => (
          <div key={index} className="mb-4">
            <p className="font-medium">{server.description}</p>
            <code className="text-sm bg-gray-100 p-1 rounded">{server.url}</code>
          </div>
        ))}
      </div>

      {/* Endpoints Section */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-bold mb-4">Endpoints</h2>
        {Object.entries(apiConfig.paths).map(([path, methods]) => (
          <div key={path} className="mb-6">
            {Object.entries(methods).map(([method, details]) => (
              <div 
                key={`${path}-${method}`} 
                className="mb-4 border-b pb-4 last:border-b-0"
              >
                <div className="flex items-center gap-2 mb-2">
                  <span className="uppercase font-bold text-blue-600">
                    {method}
                  </span>
                  <code className="text-sm bg-gray-100 p-1 rounded">
                    {path}
                  </code>
                </div>
                <p className="font-medium mb-1">{details.summary}</p>
                <p className="text-gray-600 text-sm mb-2">
                  {details.description}
                </p>
                <div className="mt-2">
                  <p className="font-medium mb-1">Responses:</p>
                  {Object.entries(details.responses).map(([status, response]) => (
                    <div key={status} className="flex gap-2 text-sm">
                      <span className="font-medium">{status}:</span>
                      <span className="text-gray-600">
                        {response.description}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default SwaggerDocs;