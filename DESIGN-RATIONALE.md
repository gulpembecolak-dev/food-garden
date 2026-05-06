# Ontwerpreflectie — Food Garden

Een korte reflectie over de visuele en interactieve keuzes achter de applicatie, los van de technische uitvoering.

## 1. De tuin als kernmetafoor

In plaats van een dashboard met dorre tabellen koos ik voor een levende tuin als hoofdbeeld. Een maaltijd wordt niet een rij in een log — het wordt een plant die opkomt. Eiwitten groeien als bomen, koolhydraten als tarwe, vetten als vetplanten, suikers als paddenstoelen. Dit doet twee dingen tegelijk: het vertaalt abstracte voeding naar iets visueel begrijpelijks, en het maakt het loggen *belonend*. Een tuin die bloeit voelt anders dan een staafdiagram dat 78% aangeeft.

## 2. Twee persona's met bewust contrast

Walter en Ann staan tegenover elkaar: 58 jaar tegenover 27, sedentair tegenover actief, gewichtsverlies tegenover spieropbouw. Die polariteit is geen toeval — het maakt direct zichtbaar dat dezelfde interface zich aanpast aan wie je bent. Eén gemeenschappelijk profiel zou de boodschap verbergen; twee uitersten dwingen het belang van personalisatie naar voren.

## 3. Kleur als betekenis, niet als decoratie

Het paletten is geen toevallige verzameling. Elke kleur draagt informatie:
- **Emerald** voor de merkidentiteit en primaire acties.
- **Macro-kleuren**: blauw voor eiwit (kracht), amber voor koolhydraten (graan), turquoise voor vetten (vetplant), rood voor suikers.
- **Statusrood/amber/groen** voor energie-uitkomsten en hydratatieklassen.
- **Persoonsaccenten**: Walter krijgt amber, Ann emerald — overal zichtbaar (avatar, navigatie, journal-entries) zodat je in één oogopslag weet wie de actieve persona is.

Een lezer kan een grafiek aflezen zonder de legenda te raadplegen, omdat de kleuren consistent een rol vervullen.

## 4. Donut vervangen door macrostaven

De originele donutgrafiek toonde decoratieve segmenten zonder relatie tot werkelijke inname. Ik koos voor horizontale macrostaven met "geconsumeerd / doel"-cijfers eronder. Reden: een staaf maakt direct zichtbaar hoe ver iemand staat tegenover zijn eigen doel. De donut bleef behouden als kleine score-ring boven, omdat één samenvattend cijfer wel waarde heeft — maar niet als hoofdvisualisatie.

## 5. Mood × energie als gestapelde balk

De originele weergave was een rij smileygezichten zonder duidelijke betekenis. De nieuwe versie beantwoordt een concrete vraag: *"Hoe reageert mijn energie als ik eet terwijl ik me X voel?"*. Per gemoedstoestand staat één gestapelde balk met de verhouding ↑ / ─ / ↓, gevolgd door één zin die de uitschieters benoemt. Eén grafiek, één conclusie — geen kijken zonder begrijpen.

## 6. Journal naast de tijdsfilters

Aanvankelijk stond het reflectievak onderaan de pagina. Maar de tijdsfilters (Deze week, Laatste 7 dagen, Deze maand) en het journal vervullen verschillende intenties: filteren versus persoonlijk noteren. Door het journal in een uitschuiflade naast de filters te plaatsen — bereikbaar via een compacte trigger — blijft de hoofdpagina rustig en krijgt het journal toch eigen ruimte zodra het opent.

## 7. Onboarding als verhaal, niet als productrondleiding

De intro vertelt vier korte stukjes: *je maaltijden vormen een tuin*, *je doelen worden uit jouw gegevens berekend*, *loggen gaat in vier stappen*, *patronen verschijnen vanzelf*. De taal staat in de tweede persoon — alsof de app tegen jou praat — niet "kijk hier zijn twee voorbeeldpersona's". Pas op het einde kies je een startsjabloon. Dit kadert Walter en Ann correct: niet als demo-figuren, maar als startpunten die je later zelf kunt aanpassen.

## 8. Visuele hiërarchie door weglaten

Bij elk paneel is de vraag gesteld: *wat kan weg?* Subtitels die hetzelfde zeggen als de titel werden geschrapt. Legenda's verdwenen wanneer kleuren intuïtief genoeg waren. Aantalcijfers onder een staaf werden verwijderd zodra de staaflengte ze al uitdrukte. De kaart over Mood × energie kromp van zes elementen naar drie — zonder informatie te verliezen, met meer rust voor het oog. Minder elementen betekent dat wat overblijft duidelijker spreekt.

---

De rode draad: ontwerp is geen versiering bovenop data, het is hoe data leesbaar wordt. Elke beslissing — kleur, vorm, plaats, weglating — staat in dienst van die leesbaarheid en van de gebruiker die tegenover de interface staat.
