export const TreePlant = ({ isNew }) => (
  <div className={`plant-avatar type-protein ${isNew ? 'is-new' : ''}`}>
    <svg width="80" height="80" viewBox="0 0 100 100" overflow="visible">
       {/* Ground Soil */}
       <ellipse cx="50" cy="90" rx="30" ry="8" fill="#5F4B32" />
       
       {/* Muscular Arm sliding in from left */}
       <path className="muscular-arm" d="M-20,60 Q10,40 30,55 Q40,60 45,60" fill="none" stroke="#FBBF24" strokeWidth="8" strokeLinecap="round" />
       <circle className="muscular-arm" cx="20" cy="45" r="8" fill="#FBBF24" />
       
       <g className="tree-group">
          {/* Trunk */}
          <path d="M45,90 Q50,70 45,50 L55,50 Q50,70 55,90 Z" fill="#8B5A2B"/>
          {/* Leaves */}
          <circle cx="50" cy="40" r="25" fill="#4ADE80" />
          <circle cx="35" cy="45" r="15" fill="#22C55E" />
          <circle cx="65" cy="45" r="15" fill="#22C55E" />
          
          {/* Apples */}
          <circle cx="50" cy="30" r="4" fill="#F97316" className="apple-all" />
          <circle cx="40" cy="40" r="4" fill="#F97316" className="apple-all" />
          <circle cx="60" cy="45" r="4" fill="#F97316" className="apple-all" />
          <circle cx="65" cy="35" r="4" fill="#F97316" className="apple-all" />
          <circle cx="35" cy="35" r="4" fill="#F97316" className="apple-single" />
       </g>
    </svg>
  </div>
);

export const MushroomPlant = ({ isNew }) => (
  <div className={`plant-avatar type-sugars ${isNew ? 'is-new' : ''}`}>
    <svg width="80" height="80" viewBox="0 0 100 100" overflow="visible" className="mushroom-svg">
       <ellipse cx="50" cy="90" rx="30" ry="8" fill="#5F4B32" />
       <path d="M45,90 Q50,60 45,40 L55,40 Q50,60 55,90 Z" fill="#F472B6"/>
       <path d="M20,45 Q50,-10 80,45 Q50,60 20,45 Z" fill="#A855F7"/>
       <circle cx="35" cy="30" r="5" fill="#E879F9" opacity="0.6"/>
       <circle cx="65" cy="35" r="6" fill="#E879F9" opacity="0.6"/>
       <circle cx="50" cy="20" r="4" fill="#E879F9" opacity="0.6"/>
    </svg>
  </div>
);

export const WheatPlant = ({ isNew }) => (
  <div className={`plant-avatar type-carbs ${isNew ? 'is-new' : ''}`}>
    <svg width="80" height="80" viewBox="0 0 100 100" overflow="visible" className="wheat-svg">
       <ellipse cx="50" cy="90" rx="30" ry="8" fill="#5F4B32" />
       <path d="M50,90 Q50,50 35,20" fill="none" stroke="#FBBF24" strokeWidth="3" />
       <path d="M50,90 Q50,40 50,20" fill="none" stroke="#FBBF24" strokeWidth="4" />
       <path d="M50,90 Q50,50 65,20" fill="none" stroke="#FBBF24" strokeWidth="3" />
       <ellipse cx="33" cy="25" rx="3" ry="8" fill="#FDE047" transform="rotate(-30 33 25)" />
       <ellipse cx="50" cy="18" rx="4" ry="10" fill="#FDE047" />
       <ellipse cx="67" cy="25" rx="3" ry="8" fill="#FDE047" transform="rotate(30 67 25)" />
       <path d="M35,70 Q25,60 15,65" fill="none" stroke="#84CC16" strokeWidth="2" />
       <path d="M65,70 Q75,60 85,65" fill="none" stroke="#84CC16" strokeWidth="2" />
    </svg>
  </div>
);

export const SucculentPlant = ({ isNew }) => (
  <div className={`plant-avatar type-fats ${isNew ? 'is-new' : ''}`}>
    <svg width="80" height="80" viewBox="0 0 100 100" overflow="visible" className="succulent-svg">
       <ellipse cx="50" cy="90" rx="30" ry="8" fill="#5F4B32" />
       <g transform="translate(50, 70)">
         <path d="M0,0 Q-30,-20 0,-40 Q30,-20 0,0" fill="#14B8A6" opacity="0.8"/>
         <path d="M0,0 Q-40,-5 -20,-30 Q0,-5 0,0" fill="#0D9488" opacity="0.9"/>
         <path d="M0,0 Q40,-5 20,-30 Q0,-5 0,0" fill="#0D9488" opacity="0.9"/>
         <path d="M0,0 Q-20,10 -30,-10 Q-10,0 0,0" fill="#115E59" />
         <path d="M0,0 Q20,10 30,-10 Q10,0 0,0" fill="#115E59" />
         <circle cx="0" cy="-15" r="8" fill="#99F6E4" />
       </g>
    </svg>
  </div>
);
