global.localStorage = { getItem: () => null } as any;
import { axiosClient } from './src/services/api.ts';
import { mapProductListItem } from './src/services/apiMappers.ts';

async function test() {
  try {
    const response = await axiosClient.get('/catalog/products/');
    const rawProducts = Array.isArray(response.data) ? response.data : response.data.results || [];
    console.log('Raw products length:', rawProducts.length);
    const mapped = rawProducts.map(mapProductListItem);
    console.log('Mapped products length:', mapped.length);
    console.log('First mapped product:', JSON.stringify(mapped[0], null, 2));
  } catch (err) {
    console.error('Error during fetch or map:', err);
  }
}

test();
