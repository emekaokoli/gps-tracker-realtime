import knex from '../../utils/db';

async function markOfflineDrivers() {
  await knex('driver_states')
    .whereRaw('last_updated < now() - interval '2 minutes'')
    .update({ state: 'offline' });
  console.log('Offline check done');
}

setInterval(markOfflineDrivers, 60_000);
