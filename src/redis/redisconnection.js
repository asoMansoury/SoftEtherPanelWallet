import Redis from 'ioredis';
import { SaveToCache } from 'src/databse/Cache/CacheManager';
import { REDIS_URL } from 'src/lib/utils';

const redis = new Redis(REDIS_URL);

redis.on('error', (err) => {
  // Suppress Redis error logs to stop repeated error messages
  // You can add custom handling here if needed
});

  export async  function Redis_Set_Data(key,data){
        // Save data to "test" key
    redis.set(key, data, (err, reply) => {
      console.log("reply : ",reply);
        if (err) {
        console.log("redis error : ",err);
        return;
        }
    });
  }

  export async function Redis_Get_Data(key){

   const result = await redis.get(key, (err, reply) => {
        if (err) {
          console.log("error redis is : ",err);
        return;
        }
    });

    return result;
  }


  export async function Redis_Delete_Key(key){

  
   const result = await redis.del(key);
    console.log("redis for delting  : ",result);
    return result;
  }

