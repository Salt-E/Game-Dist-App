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
  components: {
    securitySchemes: {
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT'
      }
    },
    schemas: {
      Game: {
        type: 'object',
        properties: {
          id: { type: 'string' },
          title: { type: 'string' },
          description: { type: 'string' },
          price: { type: 'number' },
          imageUrl: { type: 'string' },
          downloadUrl: { type: 'string' },
          createdAt: { type: 'string', format: 'date-time' },
          updatedAt: { type: 'string', format: 'date-time' }
        }
      },
      User: {
        type: 'object',
        properties: {
          id: { type: 'string' },
          name: { type: 'string' },
          email: { type: 'string' },
          image: { type: 'string' },
          role: { type: 'string', enum: ['USER', 'ADMIN'] }
        }
      }
    }
  },
  paths: {
    '/auth': {
      get: {
        tags: ['Authentication'],
        summary: 'Halaman Login',
        description: 'Menampilkan halaman login yang berisi tombol Sign in with Google',
        responses: {
          '200': {
            description: 'Halaman login berhasil ditampilkan',
            content: {
              'text/html': {
                schema: {
                  type: 'string'
                }
              }
            }
          }
        }
      }
    },
    '/auth/callback/google': {
      get: {
        tags: ['Authentication'],
        summary: 'Google OAuth Callback',
        description: 'Endpoint callback yang menerima response dari Google OAuth setelah user berhasil login',
        parameters: [
          {
            name: 'code',
            in: 'query',
            description: 'Authorization code dari Google',
            schema: { type: 'string' }
          }
        ],
        responses: {
          '302': {
            description: 'Redirect ke halaman utama setelah login berhasil'
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
    },
    '/games': {
      get: {
        tags: ['Games'],
        summary: 'Mendapatkan daftar game',
        description: 'Mengambil daftar semua game yang tersedia',
        parameters: [
          {
            name: 'page',
            in: 'query',
            description: 'Nomor halaman',
            schema: { type: 'integer', default: 1 }
          },
          {
            name: 'limit',
            in: 'query',
            description: 'Jumlah item per halaman',
            schema: { type: 'integer', default: 10 }
          }
        ],
        responses: {
          '200': {
            description: 'Daftar game berhasil diambil',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    data: {
                      type: 'array',
                      items: { $ref: '#/components/schemas/Game' }
                    },
                    meta: {
                      type: 'object',
                      properties: {
                        total: { type: 'integer' },
                        page: { type: 'integer' },
                        lastPage: { type: 'integer' }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      },
      post: {
        tags: ['Games'],
        summary: 'Menambah game baru',
        description: 'Menambahkan game baru ke database (Admin only)',
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['title', 'description', 'price'],
                properties: {
                  title: { type: 'string' },
                  description: { type: 'string' },
                  price: { type: 'number' },
                  imageUrl: { type: 'string' },
                  downloadUrl: { type: 'string' }
                }
              }
            }
          }
        },
        responses: {
          '201': {
            description: 'Game berhasil ditambahkan',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/Game' }
              }
            }
          },
          '401': {
            description: 'Unauthorized - Token tidak valid'
          },
          '403': {
            description: 'Forbidden - Hanya admin yang dapat menambah game'
          }
        }
      }
    },
    '/games/{id}': {
      get: {
        tags: ['Games'],
        summary: 'Mendapatkan detail game',
        description: 'Mengambil informasi detail sebuah game berdasarkan ID',
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            description: 'ID game',
            schema: { type: 'string' }
          }
        ],
        responses: {
          '200': {
            description: 'Detail game berhasil diambil',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/Game' }
              }
            }
          },
          '404': {
            description: 'Game tidak ditemukan'
          }
        }
      },
      put: {
        tags: ['Games'],
        summary: 'Mengupdate game',
        description: 'Mengupdate informasi game yang ada (Admin only)',
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            description: 'ID game',
            schema: { type: 'string' }
          }
        ],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  title: { type: 'string' },
                  description: { type: 'string' },
                  price: { type: 'number' },
                  imageUrl: { type: 'string' },
                  downloadUrl: { type: 'string' }
                }
              }
            }
          }
        },
        responses: {
          '200': {
            description: 'Game berhasil diupdate',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/Game' }
              }
            }
          },
          '401': {
            description: 'Unauthorized - Token tidak valid'
          },
          '403': {
            description: 'Forbidden - Hanya admin yang dapat mengupdate game'
          },
          '404': {
            description: 'Game tidak ditemukan'
          }
        }
      },
      delete: {
        tags: ['Games'],
        summary: 'Menghapus game',
        description: 'Menghapus game dari database (Admin only)',
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            description: 'ID game',
            schema: { type: 'string' }
          }
        ],
        responses: {
          '200': {
            description: 'Game berhasil dihapus'
          },
          '401': {
            description: 'Unauthorized - Token tidak valid'
          },
          '403': {
            description: 'Forbidden - Hanya admin yang dapat menghapus game'
          },
          '404': {
            description: 'Game tidak ditemukan'
          }
        }
      }
    },
    '/user/profile': {
      get: {
        tags: ['User'],
        summary: 'Mendapatkan profil user',
        description: 'Mengambil informasi profil user yang sedang login',
        security: [{ bearerAuth: [] }],
        responses: {
          '200': {
            description: 'Profil user berhasil diambil',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/User' }
              }
            }
          },
          '401': {
            description: 'Unauthorized - Token tidak valid'
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