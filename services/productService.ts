import { ProductAnalysis, ScanStatus } from '../types';

const OFF_API_URL = 'https://world.openfoodfacts.org/api/v0/product/';

export const fetchProductByBarcode = async (barcode: string): Promise<ProductAnalysis | null> => {
  try {
    const response = await fetch(`${OFF_API_URL}${barcode}.json`);
    const data = await response.json();

    if (data.status === 1) {
      const product = data.product;
      
      // Determine status based on OFF tags
      let status = ScanStatus.DOUBTFUL;
      const labels = (product.labels_tags || []).join(' ').toLowerCase();
      const ingredients = (product.ingredients_text || "").toLowerCase();
      
      if (labels.includes('halal')) {
        status = ScanStatus.HALAL;
      } else if (labels.includes('haram') || labels.includes('pork') || labels.includes('alcohol')) {
        status = ScanStatus.HARAM;
      } else {
        // Basic keyword check if no explicit label
        if (ingredients.includes('pork') || ingredients.includes('lard') || ingredients.includes('wine') || ingredients.includes('alcohol')) {
            status = ScanStatus.HARAM;
        }
      }

      return {
        productName: product.product_name || "Unknown Product",
        status: status,
        confidenceScore: 100, // It's a database match
        reason: status === ScanStatus.HALAL 
            ? "Product explicitly labeled as Halal in database." 
            : status === ScanStatus.HARAM 
            ? "Contains non-halal ingredients according to database." 
            : "No explicit Halal certification found in database. Check ingredients.",
        scholarNote: "Data sourced from OpenFoodFacts public database.",
        ingredients: product.ingredients_text ? product.ingredients_text.split(',').map((i: string) => i.trim()) : [],
        alternatives: [],
        origin: product.countries || "Unknown",
        certification: labels.includes('halal') ? "Database Verified" : undefined
      };
    }
    return null;
  } catch (error) {
    console.error("OpenFoodFacts Error:", error);
    return null;
  }
};