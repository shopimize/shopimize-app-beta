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
  const sinceDate = since ? since.toISOString() : new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString();
  
  const query = `
    query getOrders($query: String!) {
      orders(first: 250, query: $query) {
        edges {
          node {
            id
            name
            createdAt
            processedAt
            displayFinancialStatus
            displayFulfillmentStatus
            totalPriceSet {
              shopMoney {
                amount
              }
            }
            subtotalPriceSet {
              shopMoney {
                amount
              }
            }
            totalTaxSet {
              shopMoney {
                amount
              }
            }
            totalDiscountsSet {
              shopMoney {
                amount
              }
            }
            totalShippingPriceSet {
              shopMoney {
                amount
              }
            }
            lineItems(first: 100) {
              edges {
                node {
                  id
                  quantity
                  originalUnitPriceSet {
                    shopMoney {
                      amount
                    }
                  }
                  variant {
                    id
                    product {
                      id
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  `;

  const response = await fetch(`https://${shopDomain}/admin/api/2024-01/graphql.json`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Shopify-Access-Token': accessToken,
    },
    body: JSON.stringify({
      query,
      variables: {
        query: `created_at:>='${sinceDate}'`
      }
    }),
  });

  const data = await response.json();
  
  if (data.errors) {
    console.error('GraphQL errors:', data.errors);
    throw new Error('Failed to fetch orders from Shopify');
  }

  // Transform GraphQL response to match REST API format
  const orders: ShopifyOrder[] = data.data.orders.edges.map((edge: any) => ({
    id: edge.node.id.split('/').pop(),
    order_number: edge.node.name.replace('#', ''),
    created_at: edge.node.createdAt,
    processed_at: edge.node.processedAt,
    financial_status: edge.node.displayFinancialStatus,
    fulfillment_status: edge.node.displayFulfillmentStatus,
    total_price: edge.node.totalPriceSet.shopMoney.amount,
    subtotal_price: edge.node.subtotalPriceSet.shopMoney.amount,
    total_tax: edge.node.totalTaxSet.shopMoney.amount,
    total_discounts: edge.node.totalDiscountsSet.shopMoney.amount,
    total_shipping_price_set: {
      shop_money: {
        amount: edge.node.totalShippingPriceSet.shopMoney.amount
      }
    },
    line_items: edge.node.lineItems.edges.map((item: any) => ({
      id: item.node.id.split('/').pop(),
      quantity: item.node.quantity,
      price: item.node.originalUnitPriceSet.shopMoney.amount,
      product_id: item.node.variant?.product?.id.split('/').pop() || '',
    }))
  }));

  return orders;
}

export async function getInventoryCost(
  shopDomain: string,
  accessToken: string,
  inventoryItemId: string
): Promise<number> {
  const query = `
    query getInventoryItem($id: ID!) {
      inventoryItem(id: $id) {
        unitCost {
          amount
        }
      }
    }
  `;

  try {
    const response = await fetch(`https://${shopDomain}/admin/api/2024-01/graphql.json`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Access-Token': accessToken,
      },
      body: JSON.stringify({
        query,
        variables: {
          id: `gid://shopify/InventoryItem/${inventoryItemId}`
        }
      }),
    });

    const data = await response.json();
    
    if (data.errors || !data.data.inventoryItem) {
      return 0;
    }

    return parseFloat(data.data.inventoryItem.unitCost?.amount || '0');
  } catch (error) {
    console.error('Error fetching inventory cost:', error);
    return 0;
  }
}

export async function getProductsWithVariants(
  shopDomain: string,
  accessToken: string
): Promise<ShopifyProduct[]> {
  const query = `
    query getProducts {
      products(first: 250) {
        edges {
          node {
            id
            variants(first: 100) {
              edges {
                node {
                  id
                  inventoryItem {
                    id
                  }
                }
              }
            }
          }
        }
      }
    }
  `;

  const response = await fetch(`https://${shopDomain}/admin/api/2024-01/graphql.json`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Shopify-Access-Token': accessToken,
    },
    body: JSON.stringify({ query }),
  });

  const data = await response.json();
  
  if (data.errors) {
    console.error('GraphQL errors:', data.errors);
    return [];
  }

  // Transform GraphQL response to match REST API format
  const products: ShopifyProduct[] = data.data.products.edges.map((edge: any) => ({
    id: edge.node.id.split('/').pop(),
    variants: edge.node.variants.edges.map((v: any) => ({
      id: v.node.id.split('/').pop(),
      inventory_item_id: v.node.inventoryItem.id.split('/').pop(),
    }))
  }));

  return products;
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
