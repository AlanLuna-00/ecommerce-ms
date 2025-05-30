export interface AppConfig {
  database: {
    host: string;
    port: number;
    username: string;
    password: string;
    name: string;
  };
  rabbitmq: {
    url: string;
  };
}
