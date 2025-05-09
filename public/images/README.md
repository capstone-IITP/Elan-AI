# Virtual Try-On Experience Images

This directory contains images for the virtual try-on experience.

## Directory Structure

- `/clothing/` - Contains all clothing item images
- `/model/` - Contains all model images (front, side, back views)

## Adding Clothing Images

1. Add clothing images to the `/clothing/` directory
2. Use the following naming convention for consistency:
   - Tops: `item-name.jpg`
   - Bottoms: `item-name.jpg`
   - Shoes: `item-name.jpg`
   - Accessories: `item-name.jpg`
3. Recommended image size: 500x500px (square) for clothing items

## Adding Model Images

1. Add model images to the `/model/` directory
2. Use the following naming convention:
   - Female front view: `female_model_front.jpg`
   - Female side view: `female_model_side.jpg`
   - Female back view: `female_model_back.jpg`
   - Male front view: `male_model_front.jpg`
   - Male side view: `male_model_side.jpg`
   - Male back view: `male_model_back.jpg`
3. Recommended image size: approximately 600x800px (portrait)

## Image Requirements

- All images should have transparent backgrounds for the best visual effect
- Use high-quality images with consistent lighting
- For clothing items that will be overlaid on models, remove backgrounds and save as PNG with transparency

## Troubleshooting

If images are not appearing correctly:
1. Verify file names match exactly what's expected in the code
2. Ensure image paths are correct
3. Check file formats (JPG, PNG) are supported
4. Verify image sizes are appropriate 