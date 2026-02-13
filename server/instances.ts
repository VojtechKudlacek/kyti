import Fastify from 'fastify';
import { ClimateObserver } from './classes/ClimateObserver';
import { ConfigManager } from './classes/ConfigManager';
import { DatabaseClient } from './classes/DatabaseClient';
import { EnvManager } from './classes/EnvManager';
import { Logger } from './classes/Logger';
import { Outlet } from './classes/Outlet';
import { SocketManager } from './classes/SocketManager';
import { TaskScheduler } from './classes/TaskScheduler';

export const climateObserver = new ClimateObserver();
export const configManager = new ConfigManager();
export const databaseClient = new DatabaseClient();
export const envManager = new EnvManager();
export const fastify = Fastify();
export const outlet = new Outlet();
export const taskScheduler = new TaskScheduler();
export const socketManager = new SocketManager();
export const logger = new Logger(databaseClient, socketManager);
