import Fastify from 'fastify';
import { ClimateObserver } from './classes/ClimateObserver';
import { ConfigManager } from './classes/ConfigManager';
import { DatabaseClient } from './classes/DatabaseClient';
import { EnvManager } from './classes/EnvManager';
import { Outlet } from './classes/Outlet';
import { Scheduler } from './classes/Scheduler';
import { SocketManager } from './classes/SocketManager';

export const climateObserver = new ClimateObserver();
export const configManager = new ConfigManager();
export const databaseClient = new DatabaseClient();
export const envManager = new EnvManager();
export const fastify = Fastify();
export const outlet = new Outlet();
export const scheduler = new Scheduler();
export const socketManager = new SocketManager();
