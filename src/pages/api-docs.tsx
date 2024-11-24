import dynamic from 'next/dynamic';
import 'swagger-ui-react/swagger-ui.css';

const SwaggerUI = dynamic(() => import('swagger-ui-react'), { ssr: false });

const apiSpec = {
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

export default function ApiDoc() {
  return (
    <div className="api-docs">
      <SwaggerUI spec={apiSpec} />
    </div>
  );
}