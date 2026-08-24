/*
 * Garden plants — the cut-paper vegetable cutouts, one per macro:
 *   protein → peas (legume protein)
 *   carbs   → carrot (root starch)
 *   fats    → cucumber slice (sage green, same family as the fats data color)
 *   sugars  → beet/radish (sugar beet)
 * Component names are kept (TreePlant etc.) so Home, LogMeal and Calendar
 * stay untouched.
 */

const VEGGIE_BY_TYPE = {
  protein: 'peas',
  carbs: 'carrot',
  fats: 'cucumber',
  sugars: 'radish',
};

const VeggiePlant = ({ type, isNew }) => (
  <div className={`plant-avatar veggie-plant type-${type} ${isNew ? 'is-new' : ''}`}>
    <img src={`/veggies/${VEGGIE_BY_TYPE[type]}.png`} alt="" />
    <span className="veggie-soil" aria-hidden="true" />
  </div>
);

export const TreePlant = (props) => <VeggiePlant type="protein" {...props} />;
export const WheatPlant = (props) => <VeggiePlant type="carbs" {...props} />;
export const SucculentPlant = (props) => <VeggiePlant type="fats" {...props} />;
export const MushroomPlant = (props) => <VeggiePlant type="sugars" {...props} />;
