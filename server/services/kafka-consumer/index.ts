import { Kafka } from 'kafkajs';
import knex from '../../utils/db';
import redis from '../../utils/redis';

const kafka = new Kafka({ brokers: ['localhost:9092'] });
const consumer = kafka.consumer({ groupId: 'gps-tracker' });

async function run() {
  await consumer.connect();
  await consumer.subscribe({ topic: 'driver.location.updates', fromBeginning: false });

  await consumer.run({
    eachMessage: async ({ message }) => {
      if (!message.value) return;
      const payload = JSON.parse(message.value.toString());
      const { driverId, lat, lng } = payload;

      await knex('driver_states')
        .insert({
          driver_id: driverId,
          location: knex.raw('ST_SetSRID(ST_MakePoint(?, ?), 4326)', [lng, lat]),
          last_updated: knex.fn.now(),
        })
        .onConflict('driver_id')
        .merge();

      await redis.publish('driver_location_updates', JSON.stringify(payload));
    },
  });
}

run().catch(console.error);
