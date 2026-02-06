import '@shopify/shopify-api/adapters/node';
import { shopifyApi, ApiVersion, Session } from '@shopify/shopify-api';

const shopify = shopifyApi({
  apiKey: process.env.SHOPIFY_API_KEY!,
  apiSecretKey: process.env.SHOPIFY_API_SECRET!,
  scopes: process.env.SHOPIFY_SCOPES!.split(','),
  hostName: process.env.NEXTAUTH_URL!.replace(/https?:\/\//, ''),
  apiVersion: ApiVersion.January24,
  isEmbeddedApp: false,
});

export interface ShopifyOrder {
  id: string;
  order_number: string;
  created_at: string;
  processed_at: string;
  financial_status: string;
  fulfillment_status: string | null;
  total_price: string;
  subtotal_price: string;
  total_tax: string;
  total_discounts: string;
  total_shipping_price_set: {
    shop_money: {
      amount: string;
    }
  };
  line_items: Array<{
    id: string;
    quantity: number;
    price: string;
    product_id: string;
  }>;
}

export interface ShopifyProduct {
  id: string;
  variants: Array<{
    id: string;
    inventory_item_id: string;
  }>;
}

export interface InventoryCost {
  cost: string;
}

export async function getShopifyOrders(
  shopDomain: string,
  accessToken: string,
  since?: Date
): Promise<ShopifyOrder[]> {
  const session = new Session({
    id: shopDomain,
    shop: shopDomain,
    state: 'state',
    isOnline: false,
    accessToken: accessToken,
  });

  const client = new shopify.clients.Rest({ session });
  
  const params: any = {
    status: 'any',
    limit: 250,
  };
  
  if (since) {
    params.created_at_min = since.toISOString();
  }

  const response = await client.get({
    path: 'orders',
    query: params,
  });

  return response.body.orders as ShopifyOrder[];
}

export async function getInventoryCost(
  shopDomain: string,
  accessToken: string,
  inventoryItemId: string
): Promise<number> {
  const session = new Session({
    id: shopDomain,
    shop: shopDomain,
    state: 'state',
    isOnline: false,
    accessToken: accessToken,
  });

  const client = new shopify.clients.Rest({ session });

  try {
    const response = await client.get({
      path: `inventory_items/${inventoryItemId}`,
    });

    const item = response.body.inventory_item as InventoryCost;
    return parseFloat(item.cost || '0');
  } catch (error) {
    console.error('Error fetching inventory cost:', error);
    return 0;
  }
}

export async function getProductsWithVariants(
  shopDomain: string,
  accessToken: string
): Promise<ShopifyProduct[]> {
  const session = new Session({
    id: shopDomain,
    shop: shopDomain,
    state: 'state',
    isOnline: false,
    accessToken: accessToken,
  });

  const client = new shopify.clients.Rest({ session });

  const response = await client.get({
    path: 'products',
    query: { limit: 250 },
  });

  return response.body.products as ShopifyProduct[];
}

export async function calculateOrderCost(
  shopDomain: string,
  accessToken: string,
  order: ShopifyOrder
): Promise<number> {
  let totalCost = 0;

  // Get all products to map variant IDs to inventory item IDs
  const products = await getProductsWithVariants(shopDomain, accessToken);
  
  const variantToInventoryMap = new Map<string, string>();
  products.forEach(product => {
    product.variants.forEach(variant => {
      variantToInventoryMap.set(variant.id, variant.inventory_item_id);
    });
  });

  // Calculate cost for each line item
  for (const lineItem of order.line_items) {
    const inventoryItemId = variantToInventoryMap.get(lineItem.product_id);
    if (inventoryItemId) {
      const cost = await getInventoryCost(shopDomain, accessToken, inventoryItemId);
      totalCost += cost * lineItem.quantity;
    }
  }

  return totalCost;
}

export { shopify };
