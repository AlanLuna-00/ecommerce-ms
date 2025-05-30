import {AppConfig} from "./config.type";

export const CONFIG_KEYS = {
  DATABASE: 'database' as keyof AppConfig,
  RABBITMQ: 'rabbitmq' as keyof AppConfig,
};

export const QUEUE_NAMES = {
  RABBITMQ_SERVICE: 'RABBITMQ_SERVICE',
  USER_QUEUE: 'user_events_queue',
};
