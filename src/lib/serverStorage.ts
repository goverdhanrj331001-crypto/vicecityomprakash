import fs from 'fs';
import path from 'path';
import type { AdminProduct } from './adminData';
import { INITIAL_PRODUCTS } from './adminData';

const filePath = path.join(process.cwd(), 'src/lib/custom_products.json');

export function getCustomProducts(): AdminProduct[] {
  try {
    if (fs.existsSync(filePath)) {
      const data = fs.readFileSync(filePath, 'utf8');
      return JSON.parse(data);
    }
  } catch (err) {
    console.error('Error reading custom products:', err);
  }
  return [];
}

export function getAllProducts(): AdminProduct[] {
  const customs = getCustomProducts();
  const initial = INITIAL_PRODUCTS;
  
  // Combine, avoiding duplicates by slug
  const combined = [...customs];
  initial.forEach((initProd) => {
    if (!combined.some((p) => p.slug === initProd.slug)) {
      combined.push(initProd);
    }
  });
  
  return combined;
}

export function saveCustomProduct(product: AdminProduct): void {
  try {
    const products = getCustomProducts();
    const existingIndex = products.findIndex((p) => p.slug === product.slug);
    if (existingIndex > -1) {
      products[existingIndex] = product;
    } else {
      products.push(product);
    }
    
    // Ensure parent directory exists
    const dir = path.dirname(filePath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    
    fs.writeFileSync(filePath, JSON.stringify(products, null, 2), 'utf8');
  } catch (err) {
    console.error('Error saving custom product:', err);
  }
}

export function deleteCustomProductBySlug(slug: string): void {
  try {
    const products = getCustomProducts();
    const filtered = products.filter((p) => p.slug !== slug);
    fs.writeFileSync(filePath, JSON.stringify(filtered, null, 2), 'utf8');
  } catch (err) {
    console.error('Error deleting custom product:', err);
  }
}
