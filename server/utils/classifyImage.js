// Replace this with real TensorFlow.js logic later
export const classifyImage = (file) => {
  const categories = ['plastic', 'paper', 'glass', 'metal', 'organic'];
  const category = categories[Math.floor(Math.random() * categories.length)];
  const confidence = Math.floor(80 + Math.random() * 20);
  const pointsEarned = 10;

  const instructionsMap = {
    plastic: ['Rinse the bottle', 'Separate cap', 'Recycle it'],
    paper: ['Shred paper', 'Keep dry', 'Recycle'],
    metal: ['Remove labels', 'Crush can', 'Recycle'],
    glass: ['Wash it', 'Don’t mix colors', 'Recycle carefully'],
    organic: ['Compost it', 'Avoid plastic with it', 'Dry first']
  };

  return {
    category,
    confidence,
    instructions: instructionsMap[category],
    pointsEarned
  };
};
