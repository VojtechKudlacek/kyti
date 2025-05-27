import Database from 'better-sqlite3';
import Fastify from 'fastify';
import { DhtSensor } from './classes/DhtSensor';
import { Outlet } from './classes/Outlet';
import { Scheduler } from './classes/Scheduler';
import { SocketManager } from './classes/SocketManager';
import { config } from './config';

export const databaseClient = new Database(config.database.name);
export const fastify = Fastify();
export const scheduler = new Scheduler();
export const outlet = new Outlet();
export const dht = new DhtSensor();
export const socketManager = new SocketManager();
