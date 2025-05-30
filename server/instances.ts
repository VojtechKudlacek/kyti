import Database from 'better-sqlite3';
import Fastify from 'fastify';
import { ClimateObserver } from './classes/ClimateObserver';
import { Outlet } from './classes/Outlet';
import { Scheduler } from './classes/Scheduler';
import { SocketManager } from './classes/SocketManager';
import { config } from './config';

export const climateObserver = new ClimateObserver();
export const databaseClient = new Database(config.database.name);
export const fastify = Fastify();
export const outlet = new Outlet();
export const scheduler = new Scheduler();
export const socketManager = new SocketManager();
