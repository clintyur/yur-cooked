/* global React, Nav, Footer, Icon, Ticker */
const { useState: useStateP, useEffect: useEffectP } = React;

// ─── EFFECT TOGGLES ──────────────────────────────────────────────────────────
// Flip to true to enable the liquid mercury wordmark effect on the hero
const GOOEY_WORDMARK = false;
// ─────────────────────────────────────────────────────────────────────────────

/* ============ HOME ============ */
function HomePage({ setPage }) {
  const go = (p) => (e) => { e.preventDefault(); setPage(p); window.scrollTo({ top: 0, behavior: "instant" }); };
  return (
    <div className="page">
      {/* Hero */}
      <section className="hero">
        <div className="hero-img">
          <image-slot id="home-hero" placeholder="Hero — wide cinematic food / lifestyle shot" shape="rect"></image-slot>
        </div>
        <div className="hero-top">
          <div className="stack">
            <span>Est. 2023</span>
            <span className="num">Vol. 01</span>
          </div>
          <div className="stack" style={{ textAlign: "right" }}>
            <span>New York · 40.71°N</span>
            <span className="num">@clintyurr</span>
          </div>
        </div>
        <h1 className={"hero-wordmark" + (GOOEY_WORDMARK ? " wordmark-gooey" : "")}>yur cooked.</h1>
        <div className="hero-content">
          <div className="hero-meta">
            <p className="hero-tagline">Recipes. Goods. The art of eating well — from a kitchen run on instinct.</p>
            <a href="#" onClick={go("recipe")} className="link-arrow" style={{ color: "#f8f3e7", borderColor: "#f8f3e7" }}>
              See the Recipes <Icon.arrow className="arrow"/>
            </a>
          </div>
        </div>
      </section>

      {/* Ticker */}
      <Ticker items={["The Recipes", "Free to Read", "31 & Counting", "Shop the Goods", "Private Dinners", "Vol. 01"]}/>

      {/* Intro / quote */}
      <section className="container">
        <div className="intro">
          <div>
            <div className="eyebrow"><span className="dot"></span>A note from the kitchen</div>
            <h2 className="intro-quote">
              I'm Clint — a private chef cooking, photographing, and writing about food I'd actually serve <span className="it">at my own table.</span>
            </h2>
            <div className="intro-sig">
              <span className="signature">— clint</span>
              <span>Chef · Creator</span>
            </div>
          </div>
          <div className="intro-body">
            <p>My sisters and I had to learn to cook when our mom went back to teaching — somebody had to make dinner. I figured it out from YouTube and cookbooks (still do, honestly).</p>
            <p>Then high school. My friends and I would smoke, get hungry, and I'd just start cooking. They couldn't get enough — and watching people get happy from a plate I made? That's the whole thing for me.</p>
            <a href="#" onClick={go("about")} className="link-arrow" style={{ marginTop: 16 }}>Read the full story <Icon.arrow className="arrow"/></a>
          </div>
        </div>
      </section>

      <hr className="rule"/>

      {/* Preview sections */}
      <section className="container section">
        <div className="section-head">
          <div>
            <div className="eyebrow"><span className="dot"></span>Index</div>
            <h2 className="section-title">Yur next favorite<br/><span className="it">thing</span> is here.</h2>
          </div>
          <p className="section-lede">A working notebook of recipes I cook on repeat. A tight collection of goods I actually wear in the kitchen. And the long version of how all of this started — for the people who like the long version.</p>
        </div>

        <div className="preview-grid">
          <a href="#" onClick={go("recipe")} className="preview">
            <div className="preview-img">
              <span className="badge">New</span>
              <img src="images/recipe-preview-bg.jpg" alt="Recipes" style={{width:"100%",height:"100%",objectFit:"cover",display:"block",filter:"blur(6px)",transform:"scale(1.08)"}}/>
            </div>
            <div className="preview-meta">
              <h3 className="preview-name">The <span className="it">Recipe Stash</span></h3>
              <span className="preview-num">01 / 03</span>
            </div>
            <p className="preview-desc">31 recipes I cook on repeat. Free to read. Reads more like a cookbook than a blog.</p>
            <span className="preview-cta">See the Recipes <Icon.arrow/></span>
          </a>
          <a href="#" onClick={go("shop")} className="preview">
            <div className="preview-img coming-soon-img">
              <span className="coming-soon-text">coming<br/>soon.</span>
            </div>
            <div className="preview-meta">
              <h3 className="preview-name">The <span className="it">Goods</span></h3>
              <span className="preview-num">02 / 03</span>
            </div>
            <p className="preview-desc">Aprons, denim, knife sheaths. Built to take a beating, then some.</p>
            <span className="preview-cta">Shop Now <Icon.arrow/></span>
          </a>
          <a href="#" onClick={go("about")} className="preview">
            <div className="preview-img coming-soon-img">
              <span className="coming-soon-text">coming<br/>soon.</span>
            </div>
            <div className="preview-meta">
              <h3 className="preview-name">The <span className="it">Story</span></h3>
              <span className="preview-num">03 / 03</span>
            </div>
            <p className="preview-desc">From cooking dinner for my sisters to feeding a few hundred thousand of you.</p>
            <span className="preview-cta">Read More <Icon.arrow/></span>
          </a>
        </div>
      </section>

      {/* YouTube */}
      <hr className="rule"/>
      <WatchSection/>
    </div>
  );
}

/* ============ RECIPE BOOK ============ */
const RECIPES = [
  {
    n: "01",
    name: "Spanish Omelette with Taleggio, Bacon & Spinach",
    tags: ["Brunch", "30 min"],
    serves: "2–3",
    imgs: ["images/omelette-01.jpg", "images/omelette-02.jpg"],
    ingredients: [
      { section: "The Base" },
      { name: "Thick-cut bacon",      amount: "3 strips",      img: "images/ingredients/bacon.png" },
      { name: "Spinach",              amount: "1 handful",     img: "images/ingredients/spinach.png" },
      { name: "Yukon Gold potatoes",  amount: "2 small",       img: "images/ingredients/potato.png" },
      { section: "The Omelette" },
      { name: "Eggs",                 amount: "4 large",       img: "images/ingredients/eggs.png" },
      { name: "Taleggio",             amount: "10–12 cubes",   img: "images/ingredients/taleggio.png" },
      { name: "Olive oil",            amount: "for frying",    img: "images/ingredients/olive-oil.png" },
      { name: "Salt",                 amount: "to taste",      img: "images/ingredients/salt.png" },
      { name: "Black pepper",         amount: "to taste",      img: "images/ingredients/black-pepper.png" },
      { section: "To Finish" },
      { name: "Sharp white cheddar",  amount: "finely grated", img: "images/ingredients/cheddar.png" },
      { name: "Chives",               amount: "to top",        img: "images/ingredients/chives.png" },
      { name: "Croissant toast",      amount: "to serve",      img: "images/ingredients/croissant.png" },
    ],
    steps: [
      { section: "Prep" },
      { text: "Chop 3 strips of thick-cut bacon into small pieces. Add to a pan over medium heat and stir constantly until fully cooked and crispy." },
      { text: "Add a handful of spinach to the same pan. Cook until wilted, season with salt and pepper, then transfer to a bowl and set aside." },
      { text: "Remove the spinach from the bowl and squeeze out all the excess liquid. Place on a cutting board, cut into 4 pieces, and return to the bowl." },
      { text: "Peel 2 small Yukon Gold potatoes and place in a bowl of water to rinse off the starch. Using the same peeler like a mandoline, thinly slice the potatoes into the water. Remove and lay on a paper-towel-lined sheet tray, patting completely dry." },
      { text: "Crack 4 eggs into a bowl and season lightly with salt and pepper. Whisk until fully combined and smooth, then set aside." },
      { text: "Cube a generous amount of Taleggio — about 10–12 pieces — and set aside for later." },
      { section: "Cook" },
      { text: "Heat a small non-stick pan over medium with a drizzle of olive oil. Once hot, add a small handful of the sliced potatoes and fry until golden and crispy." },
      { text: "Once the potatoes are crispy, swirl the pan to coat evenly with oil. Pour in the whisked eggs and gently scramble. Add the Taleggio, bacon, and spinach, giving everything a light stir to combine." },
      { text: "Maintain steady medium heat. Every 1–2 minutes, gently pull the edges toward the center to let uncooked egg flow in and cook. Continue until just a minimal amount of wet egg remains." },
      { text: "When the omelette is set and semi-firm, place a small sheet tray over the pan. Press down and carefully flip the omelette onto the tray. Lightly oil the pan again, then slide it back in to cook the other side for at least 3–4 minutes — longer if you prefer a firmer omelette." },
      { section: "Plate" },
      { text: "Transfer to a cutting board and slice into 3 pieces." },
      { text: "Top with finely grated sharp white cheddar and a sprinkle of chives. Serve alongside croissant toast." },
    ],
  },
  {
    n: "02",
    name: "Citrus Olive Oil Cake",
    tags: ["Dessert", "Make-Ahead"],
    serves: "4–6",
    img: "images/cake-olive-oil.jpg",
    ingredients: [
      { section: "The Cake" },
      { name: "All-purpose flour",  amount: "1 cup",              img: "images/ingredients/flour.png" },
      { name: "Almond flour",       amount: "½ cup",              img: "images/ingredients/almond-flour.png" },
      { name: "Baking powder",      amount: "1 tsp",              img: "images/ingredients/baking-powder.png" },
      { name: "Baking soda",        amount: "¼ tsp",              img: "images/ingredients/baking-soda.png" },
      { name: "Salt",               amount: "½ tsp",              img: "images/ingredients/salt.png" },
      { name: "Eggs",               amount: "3 large",            img: "images/ingredients/eggs.png" },
      { name: "Granulated sugar",   amount: "1 cup",              img: "images/ingredients/sugar.png" },
      { name: "Olive oil",          amount: "¾ cup",              img: "images/ingredients/olive-oil.png" },
      { name: "Whole milk",         amount: "½ cup",              img: "images/ingredients/milk.png" },
      { name: "Vanilla bean",       amount: "1",                  img: "images/ingredients/vanilla-bean.png" },
      { name: "Orange",             amount: "1, zested & juiced", img: "images/ingredients/orange.png" },
      { name: "Lemon",              amount: "2, zested & juiced", img: "images/ingredients/lemon.png" },
      { section: "Whipped Cream" },
      { name: "Heavy cream",        amount: "1½ cups, cold",      img: "images/ingredients/heavy-cream.png" },
      { name: "Powdered sugar",     amount: "2 tbsp, sifted",     img: "images/ingredients/powdered-sugar.png" },
      { name: "Vanilla extract",    amount: "1 tsp",              img: "images/ingredients/vanilla-extract.png" },
      { section: "Blueberry Compote" },
      { name: "Blueberries",        amount: "2 cups",             img: "images/ingredients/blueberries.png" },
      { name: "Granulated sugar",   amount: "3 tbsp",             img: "images/ingredients/sugar.png" },
      { name: "Lemon juice",        amount: "2 tbsp fresh",       img: "images/ingredients/lemon.png" },
      { name: "Lemon zest",         amount: "1 tsp",              img: "images/ingredients/lemon.png" },
      { name: "Vanilla extract",    amount: "½ tsp",              img: "images/ingredients/vanilla-extract.png" },
      { name: "Kosher salt",        amount: "pinch",              img: "images/ingredients/salt.png" },
      { section: "To Serve" },
      { name: "Powdered sugar",     amount: "for dusting",        img: "images/ingredients/powdered-sugar.png" },
      { name: "Lemon zest",         amount: "fresh, to finish",   img: "images/ingredients/lemon.png" },
    ],
    steps: [
      { section: "The Cake" },
      { text: "Preheat your oven to 350°F." },
      { text: "Combine all your dry ingredients in a single bowl: 1 cup all-purpose flour, ½ cup almond flour, 1 teaspoon baking powder, ¼ teaspoon baking soda, and ½ teaspoon salt. Whisk until fully combined and evenly distributed." },
      { text: "Crack 3 eggs into a separate bowl, then add 1 cup granulated sugar, ¾ cup olive oil, ½ cup whole milk, and the seeds from 1 vanilla bean. Mix thoroughly until smooth." },
      { text: "Into the wet ingredients, zest a whole orange and a whole lemon, then squeeze in both juices. Mix until fully incorporated and fragrant." },
      { text: "Pour the wet ingredients into the dry and mix until fully combined — no strange lumps." },
      { text: "Line a cake pan with parchment paper and pour in your batter, leaving about a ¼-inch gap at the top to allow for rising." },
      { text: "Bake at 350°F for 40–45 minutes, or until a toothpick inserted in the center comes out clean. Let cool completely before serving." },
      { section: "Whipped Cream" },
      { text: "Chill your bowl and beaters in the freezer for 10 minutes before starting. Cold equipment gives you more stable, billowy cream." },
      { text: "Pour 1½ cups cold heavy whipping cream into the chilled bowl. Beat on medium speed until the cream begins to thicken, then add 2 tablespoons sifted powdered sugar and 1 teaspoon vanilla extract." },
      { text: "Continue beating until you reach medium peaks — thick and holding their shape when the beaters are lifted, but still with a gentle curl at the tip. Don't overwhip. Refrigerate until ready to use." },
      { section: "Blueberry Compote" },
      { text: "Combine 2 cups blueberries, 3 tablespoons sugar, 2 tablespoons fresh lemon juice, and a pinch of kosher salt in a small saucepan over medium heat." },
      { text: "Cook, stirring occasionally, until the berries begin to burst and release their juices, about 3–4 minutes. Continue cooking until the compote is thick, glossy, and jammy — another 5–6 minutes." },
      { text: "Remove from heat. Stir in 1 teaspoon lemon zest and ½ teaspoon vanilla extract. Let cool to room temperature — it thickens more as it sits. Can be made up to 3 days ahead." },
      { section: "To Plate" },
      { text: "Dust a plate lightly with powdered sugar through a fine sieve for an even, elegant coat." },
      { text: "Place a slice of cooled cake slightly off-center on the plate." },
      { text: "Add a generous spoonful of whipped cream alongside the cake, shaping it into a soft mound with the back of a spoon." },
      { text: "Spoon the blueberry compote over the top of the cake, letting it drip down the sides and pool slightly on the plate." },
      { text: "Finish with fresh lemon zest scattered over everything and a final light dusting of powdered sugar. Serve immediately. Trust me." },
    ],
  },
  {
    n: "03",
    name: "Confit Leeks & Burrata",
    tags: ["Starter", "Vegetarian"],
    serves: "2–4",
    imgs: ["images/confit-leeks-01.jpg", "images/confit-leeks-02.jpg"],
    ingredients: [
      { section: "The Confit" },
      { name: "Leeks",              amount: "6–7, white & pale green only", img: "images/ingredients/leek.png" },
      { name: "Garlic",             amount: "4–5 cloves, smashed",          img: "images/ingredients/garlic.png" },
      { name: "Whole peppercorns",  amount: "10–15",                        img: "images/ingredients/black-pepper.png" },
      { name: "Fresh thyme",        amount: "4–5 sprigs",                   img: "images/ingredients/thyme.png" },
      { name: "Fresh rosemary",     amount: "4–5 sprigs",                   img: "images/ingredients/rosemary.png" },
      { name: "Bay leaves",         amount: "2",                            img: "images/ingredients/bay-leaf.png" },
      { name: "Lemon rind",         amount: "a couple strips",              img: "images/ingredients/lemon.png" },
      { name: "Olive oil",          amount: "enough to submerge",           img: "images/ingredients/olive-oil.png" },
      { section: "To Plate" },
      { name: "Burrata",            amount: "1 ball",                       img: "images/ingredients/burrata.png" },
      { name: "Fig balsamic glaze", amount: "to drizzle",                   img: "images/ingredients/fig-balsamic.png" },
      { name: "Whipped honey",      amount: "a touch",                      img: "images/ingredients/honey.png" },
      { name: "Flaky salt",         amount: "to finish",                    img: "images/ingredients/salt.png" },
      { name: "Baguette",           amount: "to serve",                     img: "images/ingredients/baguette.png" },
    ],
    steps: [
      { section: "The Confit" },
      { text: "Trim the tough, dark green tops from 6–7 leeks, keeping only the tender, pale green and white parts. Slice into 1–1.5-inch pieces, then rinse thoroughly to remove any dirt or grit. Pat them dry — you want them clean, not soggy." },
      { text: "Place the leeks in a pot or pan large enough to hold them. Add 4–5 smashed garlic cloves, 10–15 whole peppercorns, 4–5 sprigs each of thyme and rosemary, 2 bay leaves, and a couple strips of lemon rind. Everything goes in together — this is your flavor base." },
      { text: "Pour in enough olive oil to completely submerge everything. Set over the lowest heat and let it slowly come up to temperature — you're looking for a gentle, lazy bubble, nothing aggressive. The goal is to let the leeks and aromatics infuse, not fry." },
      { text: "While the oil comes up to temp, preheat your oven to 275°F. Once ready, transfer the whole pot — leeks, oil, and all — into the oven. Cook low and slow for about 1½ hours, or until the leeks are melt-in-your-mouth tender when pierced with a fork." },
      { text: "Carefully pull the pot from the oven and let everything cool before plating. That oil is hot as hell — give it a few minutes before you touch anything." },
      { section: "To Plate" },
      { text: "Grab a plate and place half a burrata — or a whole one if you're feeling generous — right in the center. If using a full ball, cut it open so that creamy center shows off a little. Drizzle with fig balsamic glaze and a touch of whipped honey." },
      { text: "Add 2–3 confit leeks alongside with a spoonful of that golden oil, then finish with a pinch of flaky salt. Serve with baguette or whatever good bread you've got on hand." },
    ],
  },
  {
    n: "04",
    name: "Creamy Chicken and Kale Pasta",
    tags: ["Mains", "Comfort"],
    serves: "4–6",
    img: "images/chicken-kale-pasta.jpg",
    ingredients: [
      { section: "The Crunch Topping" },
      { name: "Panko breadcrumbs",    amount: "equal parts w/ pistachios", img: "images/ingredients/panko.png" },
      { name: "Pistachios",           amount: "crushed to panko size",      img: "images/ingredients/pistachios.png" },
      { name: "Olive oil",            amount: "to coat",                    img: "images/ingredients/olive-oil.png" },
      { name: "Garlic",               amount: "2–3 cloves, smashed",        img: "images/ingredients/garlic.png" },
      { name: "Fresh rosemary",       amount: "1–2 sprigs",                 img: "images/ingredients/rosemary.png" },
      { name: "Fresh thyme",          amount: "1–2 sprigs",                 img: "images/ingredients/thyme.png" },
      { section: "The Pasta" },
      { name: "Chicken thighs",       amount: "bite-sized cubes",           img: "images/ingredients/chicken.png" },
      { name: "Shallot",              amount: "1 large, diced",             img: "images/ingredients/shallot.png" },
      { name: "Garlic",               amount: "5 cloves total",             img: "images/ingredients/garlic.png" },
      { name: "Kale",                 amount: "1 bunch, chopped",           img: "images/ingredients/kale.png" },
      { name: "White wine",           amount: "1 cup",                      img: "images/ingredients/white-wine.png" },
      { name: "Chicken stock",        amount: "3–4 cups",                   img: "images/ingredients/chicken-stock.png" },
      { name: "Pasta",                amount: "of choice",                  img: "images/ingredients/pasta.png" },
      { name: "Heavy cream",          amount: "1 cup",                      img: "images/ingredients/heavy-cream.png" },
      { name: "Parmigiano Reggiano",  amount: "1–2 cups, grated",           img: "images/ingredients/parmesan.png" },
      { name: "Butter",               amount: "2 tbsp",                     img: "images/ingredients/butter.png" },
      { name: "Salt & black pepper",  amount: "to taste",                   img: "images/ingredients/salt.png" },
    ],
    steps: [
      { section: "The Crunch Topping" },
      { text: "Preheat your oven to 375°F." },
      { text: "Crush pistachios until they're about the size of panko, or slightly bigger — a food processor works perfectly. On a sheet tray, combine equal parts panko and crushed pistachios, drizzle with olive oil, and add 2–3 smashed garlic cloves plus 1–2 sprigs each of rosemary and thyme." },
      { text: "Bake at 375°F for 10–15 minutes until golden and toasted. Remove from the oven and set aside to cool." },
      { section: "The Pasta" },
      { text: "Dice a large shallot and thinly slice 3 garlic cloves. Set aside. Cut the chicken thighs into bite-sized cubes and smash 2 more garlic cloves with 2 sprigs each of rosemary and thyme to cook with the chicken." },
      { text: "Wash a bunch of kale and chop into bite-sized pieces." },
      { text: "Heat a large pot over medium-high with a drizzle of oil. Add the chicken, season with salt, and spread evenly. Let it sit undisturbed until a golden crust forms on one side." },
      { text: "Flip each piece. Add the 2 smashed garlic cloves, rosemary, and thyme. Drizzle in a bit more oil, shake the pot gently, and let the other side crust up golden." },
      { text: "Once golden on both sides, remove the chicken and set aside in a bowl." },
      { text: "Add a bit more oil and reduce heat to medium. Add the shallot and sliced garlic, then the kale. Sauté until the kale wilts and shrinks down." },
      { text: "Pour in 1 cup of white wine. Let it cook until the alcohol cooks off and the liquid reduces slightly." },
      { text: "Add 3–4 cups of chicken stock and the chicken. Simmer and reduce for 15–20 minutes." },
      { text: "Meanwhile, bring a separate pot of heavily salted water to a rolling boil. Cook your pasta of choice. Before straining, save about ¼ cup of pasta water." },
      { text: "Stir 1 cup of heavy cream into the chicken-stock mixture. Add a generous amount of Parmigiano Reggiano — a cup, maybe two — and mix until rich and creamy." },
      { text: "Season with salt and pepper. Add the pasta and pasta water. Stir in 2 tablespoons of butter. Creamy, cheesy perfection." },
      { section: "To Serve" },
      { text: "Serve in a bowl, scooping up plenty of sauce and chicken. Top generously with Parmigiano Reggiano and a big sprinkle of the toasted panko-pistachio crunch." },
    ],
  },
  {
    n: "05",
    name: "Luther Burger",
    tags: ["Mains", "Smash Burger"],
    serves: "2–4",
    img: "images/luther-burger.jpg",
    ingredients: [
      { section: "The Bacon Jam" },
      { name: "Bacon",                amount: "4–6 slices, thinly sliced",  img: "images/ingredients/bacon.png" },
      { name: "Red onion",            amount: "1, half-moon sliced",         img: "images/ingredients/red-onion.png" },
      { name: "Butter",               amount: "a knob",                      img: "images/ingredients/butter.png" },
      { name: "Brown sugar",          amount: "2–3 tbsp",                    img: "images/ingredients/brown-sugar.png" },
      { name: "Champagne vinegar",    amount: "2 tbsp",                      img: "images/ingredients/champagne-vinegar.png" },
      { name: "Balsamic glaze",       amount: "2–3 tbsp",                    img: "images/ingredients/fig-balsamic.png" },
      { name: "Salt",                 amount: "to taste",                    img: "images/ingredients/salt.png" },
      { section: "The Smash Burger" },
      { name: "80/20 ground beef",    amount: "1 lb, 4 portions",            img: "images/ingredients/ground-beef.png" },
      { name: "Beef tallow",          amount: "for the pan",                 img: "images/ingredients/beef-tallow.png" },
      { name: "American cheese",      amount: "1 slice per patty",           img: "images/ingredients/american-cheese.png" },
      { name: "Salt & black pepper",  amount: "to season",                   img: "images/ingredients/salt.png" },
      { section: "To Build" },
      { name: "Glazed donuts",        amount: "2–4, as the bun",             img: "images/ingredients/donut.png" },
      { name: "Sauce of choice",      amount: "to taste",                    img: "images/ingredients/fig-balsamic.png" },
    ],
    steps: [
      { section: "The Bacon Jam" },
      { text: "Divide 1 pound of 80/20 ground beef into 4 even portions. Shape each into a ball and set aside." },
      { text: "Thinly slice 4–6 bacon strips. Place in a cold pan over medium heat and stir constantly until perfectly crispy. Remove and discard the bacon fat." },
      { text: "Trim both ends off a red onion, halve it, and slice thinly into half-moon shapes." },
      { text: "Heat the same pan over medium-low. Add a knob of butter and all the sliced onions. Sauté until beautifully caramelized, seasoning with salt as you go — this draws out moisture and builds flavor. Lower the heat if the pan gets too hot." },
      { text: "Stir in 2–3 tablespoons of brown sugar, then 2 tablespoons of champagne vinegar. Fold in the crispy bacon until combined." },
      { text: "Stir in 2–3 tablespoons of balsamic glaze. Taste and adjust with more glaze, brown sugar, or salt. Bacon jam is done." },
      { section: "The Smash Burger" },
      { text: "Cut a large sheet of parchment into 4 squares — about 2–3 times the size of your beef balls. Place each ball on its own square." },
      { text: "Heat a cast iron or stainless steel pan over medium-high until smoking hot." },
      { text: "Add a knob of beef tallow and coat the surface. Place a beef ball in the pan with parchment on top. Press down hard with a second pan and smash it flat." },
      { text: "Remove the parchment, season immediately with salt and pepper. Cook 45–60 seconds, then flip. Add a slice of American cheese and cook another 45–60 seconds. Transfer to your glazed donut." },
      { text: "Repeat for the remaining patties — stack a second for a double if you're feeling it." },
      { section: "To Build" },
      { text: "Spoon bacon jam generously over the patty. Add whatever sauce you want, close the donut top, and go." },
    ],
  },
  {
    n: "06",
    name: "Perfect Crispy Gnocchi",
    tags: ["Mains", "Comfort"],
    serves: "2–4",
    img: "images/crispy-gnocchi.jpg",
    ingredients: [
      { section: "The Gnocchi" },
      { name: "Yukon Gold potatoes",    amount: "4 large",              img: "images/ingredients/potato.png" },
      { name: "Salt",                   amount: "for bed + seasoning",  img: "images/ingredients/salt.png" },
      { name: "Egg yolk",               amount: "1",                    img: "images/ingredients/eggs.png" },
      { name: "All-purpose flour",      amount: "⅓ cup + more if needed", img: "images/ingredients/flour.png" },
      { section: "To Crisp" },
      { name: "Butter",                 amount: "plenty",               img: "images/ingredients/butter.png" },
      { name: "Fresh sage",             amount: "optional, to taste",   img: "images/ingredients/sage.png" },
      { section: "To Finish" },
      { name: "Parmigiano Reggiano",    amount: "generous sprinkle",    img: "images/ingredients/parmesan.png" },
      { name: "Black pepper",           amount: "freshly cracked",      img: "images/ingredients/black-pepper.png" },
      { name: "Calabrian chili oil",    amount: "to drizzle",           img: "images/ingredients/calabrian-chili-oil.png" },
      { name: "Pesto",                  amount: "optional, for a herby twist", img: "images/ingredients/pesto.png" },
    ],
    steps: [
      { section: "The Gnocchi" },
      { text: "Preheat your oven to 400°F. Cover the bottom of a tray with a layer of salt. Poke holes all over 4 large Yukon Gold potatoes, lay them on the salt bed, and roast for 45–60 minutes — until a knife slides through effortlessly." },
      { text: "Let the potatoes rest 10 minutes before peeling. Pass them through a potato ricer, or roughly mash then push through a fine sieve. Add 1 egg yolk and ⅓ cup of flour, then gently knead in the bowl. Add a little more flour if the dough feels too wet, but don't overwork it." },
      { text: "Let the dough rest 20–30 minutes to relax — it makes rolling much easier." },
      { text: "Roll the dough into a log about ½ inch thick. Cut into pieces roughly ¾ inch long — perfect bite-sized gnocchi. Shape them if you like, or leave them as-is." },
      { section: "Crisp & Serve" },
      { text: "Bring a pot of salted water to a boil. Cook the gnocchi until they float, then immediately transfer to a hot pan over medium-high heat with plenty of butter. Let them crisp on one side, then flip and repeat until golden all over." },
      { text: "After the first flip, toss in some fresh sage if using. Remove to a plate and finish with a generous sprinkle of Parmigiano Reggiano, freshly cracked black pepper, and a drizzle of Calabrian chili oil. Or serve in a bowl topped with plenty of pesto for a herby twist." },
    ],
  },
  {
    n: "08",
    name: "Tomato Tart",
    tags: ["Starter", "Summer"],
    serves: "2–4",
    img: "images/tomato-tart.jpg",
    ingredients: [
      { section: "The Tart" },
      { name: "Puff pastry",         amount: "1 sheet, room temp",    img: "images/ingredients/puff-pastry.png" },
      { name: "Heirloom tomatoes",   amount: "thinly sliced",         img: "images/ingredients/heirloom-tomato.png" },
      { name: "Garlic",              amount: "2–3 cloves, razor-thin",img: "images/ingredients/garlic.png" },
      { name: "Salt",                amount: "to season",             img: "images/ingredients/salt.png" },
      { section: "To Finish" },
      { name: "Finishing olive oil", amount: "to drizzle",            img: "images/ingredients/olive-oil.png" },
      { name: "Parmigiano Reggiano", amount: "freshly grated",        img: "images/ingredients/parmesan.png" },
      { name: "Fig balsamic glaze",  amount: "to drizzle",            img: "images/ingredients/fig-balsamic.png" },
      { name: "Chives",              amount: "1 bunch, thinly sliced",img: "images/ingredients/chives.png" },
      { name: "Fresh basil",         amount: "torn, to finish",       img: "images/ingredients/basil.png" },
    ],
    steps: [
      { section: "The Tart" },
      { text: "Preheat your oven to 375°F. Take your puff pastry out and let it come to room temperature so it's easier to work with." },
      { text: "Thinly slice your heirloom tomatoes, season lightly with salt, and set aside. Slice 2–3 garlic cloves as thinly as humanly possible — razor-thin, the thinner the better." },
      { text: "Place the puff pastry on a lightly floured sheet tray. Pat the tomatoes dry, then arrange them in a stacked, staircase-like row. Top each tomato slice with a thin slice of garlic. Bake at 375°F for 15–20 minutes, until the pastry is golden and the tomatoes are perfectly cooked." },
      { text: "While the tart bakes, thinly slice a whole bunch of chives for garnish." },
      { section: "To Finish" },
      { text: "Once out of the oven, drizzle with a good finishing olive oil. Grate Parmigiano Reggiano around the edges, drizzle fig balsamic glaze over the top, and finish with a scattering of sliced chives and freshly torn basil leaves." },
    ],
  },
  {
    n: "09",
    name: "Duck Fat Roasted Potatoes",
    tags: ["Sides", "45 min"],
    serves: "4–6",
    img: "images/duck-fat-potatoes.jpg",
    ingredients: [
      { section: "The Potatoes" },
      { name: "Yukon Gold potatoes",    amount: "3 lbs, 2-inch chunks",   img: "images/ingredients/potato.png" },
      { name: "Duck fat",               amount: "1 jar (14 oz)",           img: "images/ingredients/duck-fat.png" },
      { name: "Kosher salt",            amount: "to season",               img: "images/ingredients/salt.png" },
      { name: "Garlic powder",          amount: "to season",               img: "images/ingredients/garlic.png" },
      { name: "Black pepper",           amount: "to season",               img: "images/ingredients/black-pepper.png" },
      { name: "Garlic cloves",          amount: "4–6, smashed",            img: "images/ingredients/garlic.png" },
      { name: "Fresh rosemary",         amount: "3–4 sprigs",              img: "images/ingredients/rosemary.png" },
      { name: "Fresh thyme",            amount: "3–4 sprigs",              img: "images/ingredients/thyme.png" },
      { section: "To Finish" },
      { name: "Parmigiano Reggiano",    amount: "freshly grated",          img: "images/ingredients/parmesan.png" },
      { name: "Chives",                 amount: "finely snipped",          img: "images/ingredients/chives.png" },
      { name: "Maldon flaky salt",      amount: "generous pinch",          img: "images/ingredients/salt.png" },
    ],
    steps: [
      { section: "Prep" },
      { text: "Cut 3 lbs of Yukon Gold potatoes into 2-inch chunks. No need to peel — the skin gets crispy and delicious in the duck fat." },
      { text: "Throw the chunks into a large pot, cover with cold water, and season heavily with kosher salt — it should taste like the ocean. Boil over high heat for 10–12 minutes until just fork tender. A fork should slide in with a little resistance — don't let them fall apart." },
      { text: "Drain completely. Return to the empty pot over low heat for 5 minutes to steam off any remaining moisture, shaking occasionally." },
      { text: "Turn off the heat and shake the pot hard and aggressively for a full minute. You want to crater and rough up all the edges — those rough edges are what get insanely crispy in the duck fat. Don't skip this." },
      { section: "Roast" },
      { text: "Preheat your oven to 425°F convection. Add 1 jar (14 oz) of duck fat to a large sheet pan and place in the oven until the fat is shimmering hot — about 10 minutes." },
      { text: "Pull the pan out carefully — that fat is extremely hot. Add the potatoes in a single layer. They should sizzle loudly the moment they hit the fat. If they don't, the fat isn't hot enough — back in the oven for a few more minutes." },
      { text: "Season generously with kosher salt, garlic powder, and black pepper. Roast 15–20 minutes. At the halfway flip, add 4–6 smashed garlic cloves and 3–4 sprigs each of rosemary and thyme directly into the duck fat. They'll crisp up and infuse into the fat for the last 10–15 minutes. Pull at 30–35 minutes total when deep golden and shatteringly crispy." },
      { section: "Serve" },
      { text: "Transfer immediately to a serving platter — do not let them sit on the pan or they'll steam and lose their crispiness. Shower with freshly grated Parmigiano Reggiano and finely snipped chives. Finish with a generous pinch of Maldon flaky salt." },
      { text: "Serve immediately. These do not wait for anyone." },
    ],
  },
  {
    n: "10",
    name: "Grilled Jerk Chicken with Sweet BBQ Glaze",
    tags: ["Mains", "BBQ"],
    serves: "4–6",
    imgs: ["images/jerk-chicken-01.jpg", "images/jerk-chicken-02.jpg"],
    ingredients: [
      { section: "Jerk Marinade" },
      { name: "Habanero or scotch bonnet", amount: "3 peppers, stemmed",       img: "images/ingredients/habanero.png" },
      { name: "Scallions",                 amount: "2 bunches, rough chopped",  img: "images/ingredients/scallions.png" },
      { name: "Garlic",                    amount: "4 cloves",                  img: "images/ingredients/garlic.png" },
      { name: "Fresh ginger",              amount: "1-inch knob, peeled",       img: "images/ingredients/ginger.png" },
      { name: "Lime",                      amount: "juice of 2",                img: "images/ingredients/lime.png" },
      { name: "Soy sauce",                 amount: "1 tbsp",                    img: "images/ingredients/soy-sauce.png" },
      { name: "Brown sugar",               amount: "1 tbsp",                    img: "images/ingredients/brown-sugar.png" },
      { name: "Fresh thyme",               amount: "½ bunch, leaves stripped",  img: "images/ingredients/thyme.png" },
      { name: "Neutral oil",               amount: "2 tbsp",                    img: "images/ingredients/olive-oil.png" },
      { name: "Ground allspice",           amount: "1 tbsp",                    img: "images/ingredients/allspice.png" },
      { name: "Cinnamon",                  amount: "½ tsp",                     img: "images/ingredients/cinnamon.png" },
      { name: "Nutmeg",                    amount: "¼ tsp",                     img: "images/ingredients/nutmeg.png" },
      { name: "Black pepper",              amount: "½ tsp",                     img: "images/ingredients/black-pepper.png" },
      { name: "Kosher salt",               amount: "½ tsp",                     img: "images/ingredients/salt.png" },
      { section: "Sweet BBQ Glaze" },
      { name: "Pineapple juice",           amount: "½ cup",                     img: "images/ingredients/pineapple-juice.png" },
      { name: "Brown sugar",               amount: "¼ cup, packed",             img: "images/ingredients/brown-sugar.png" },
      { name: "Ketchup",                   amount: "¼ cup",                     img: "images/ingredients/ketchup.png" },
      { name: "Honey",                     amount: "1½ tbsp",                   img: "images/ingredients/honey.png" },
      { name: "Soy sauce",                 amount: "1 tbsp",                    img: "images/ingredients/soy-sauce.png" },
      { name: "Apple cider vinegar",       amount: "1 tbsp",                    img: "images/ingredients/apple-cider-vinegar.png" },
      { name: "Fresh ginger",              amount: "½ tbsp, microplaned",       img: "images/ingredients/ginger.png" },
      { name: "Garlic",                    amount: "2 cloves, microplaned",     img: "images/ingredients/garlic.png" },
      { name: "Allspice",                  amount: "½ tsp",                     img: "images/ingredients/allspice.png" },
      { name: "Cinnamon",                  amount: "¼ tsp",                     img: "images/ingredients/cinnamon.png" },
      { name: "Black pepper",              amount: "¼ tsp",                     img: "images/ingredients/black-pepper.png" },
      { name: "Kosher salt",               amount: "pinch",                     img: "images/ingredients/salt.png" },
      { section: "Chicken" },
      { name: "Chicken leg quarters",      amount: "6",                         img: "images/ingredients/chicken.png" },
      { name: "Avocado oil",               amount: "for brushing",              img: "images/ingredients/olive-oil.png" },
    ],
    steps: [
      { section: "Marinade" },
      { text: "Add all marinade ingredients to a blender. Blend until completely smooth. Taste — it should be intensely spicy, savory, and bright. Adjust lime and salt as needed. Reserve 2 tbsp of marinade in a separate container for basting on the grill." },
      { text: "Score each chicken quarter 3 deep cuts all the way to the bone on both the thigh and drumstick. Non-negotiable — the marinade needs to get deep into the meat." },
      { text: "Coat every piece thoroughly in the jerk marinade — get it into every cut. Refrigerate uncovered for a minimum of 8 hours, ideally 24–48 hours. The longer the better." },
      { section: "The Glaze" },
      { text: "Combine all glaze ingredients in a small saucepan over medium heat. Whisk until the brown sugar dissolves. Bring to a gentle simmer, reduce to low, and simmer uncovered 15–20 minutes, stirring occasionally, until it thickens and coats the back of a spoon. Cool to room temp and refrigerate until grilling time." },
      { section: "Option A — Smoke Then Grill" },
      { text: "Pull the chicken from the fridge and let it temper at room temp for 45 minutes. Cold chicken straight from the fridge onto a hot grill is a recipe for burnt outside, raw inside." },
      { text: "Preheat your smoker to 225°F. Add 3–4 oz of hickory or pimento wood. Load the chicken quarters skin-side up. Close the door and do not open it during the cook. Smoke until internal temp hits 155°F at the thickest part of the thigh — about 2.5–3 hours. Rest uncovered 20 minutes, then refrigerate uncovered on wire racks for at least 1 hour to dry out the skin before grilling." },
      { text: "Preheat your grill to medium-high, around 375–400°F. Brush each quarter with avocado oil on all sides. Place skin-side down. Cook 5–6 minutes until deeply charred. Flip, brush with reserved jerk marinade, cook another 5–6 minutes. Keep flipping and basting until internal temp hits 158°F." },
      { text: "At 158°F switch to the sweet BBQ glaze. Brush one generous coat on each side. Grill 2–3 more minutes per side until the glaze caramelizes and lacquers over the jerk crust. Watch it closely — sugar burns fast. Pull at 165°F internal." },
      { section: "Option B — Straight Grill" },
      { text: "Pull the chicken from the fridge and let it temper at room temp for 45 minutes." },
      { text: "Preheat your grill to medium-high, around 375–400°F. Brush each quarter with avocado oil on all sides. Place skin-side down. Cook 5–6 minutes until deeply charred on the skin." },
      { text: "Flip, brush generously with reserved jerk marinade, cook 5–6 minutes on the other side. Keep flipping and basting every flip until internal temp hits 158°F. Total grill time will be about 25–35 minutes depending on the size of your quarters." },
      { text: "At 158°F switch to the sweet BBQ glaze. Brush one generous coat on each side. Grill 2–3 more minutes per side until the glaze caramelizes and lacquers. Watch closely — sugar burns fast. Pull at 165°F internal." },
      { section: "Rest & Serve" },
      { text: "Tent with foil and rest 5 minutes. Arrange on a platter with grilled pineapple rings alongside. The combination of that jerk heat underneath and the sweet caramelized glaze on top is the whole move." },
    ],
  },
  {
    n: "11",
    name: "Watermelon Mint & Feta Salad",
    tags: ["Salads", "Summer"],
    serves: "4–6",
    img: "images/watermelon-salad.jpg",
    ingredients: [
      { name: "Seedless watermelon",    amount: "½ large, 1.5-inch cubes",       img: "images/ingredients/watermelon.png" },
      { name: "Persian cucumbers",      amount: "2, thin rounds",                img: "images/ingredients/cucumber.png" },
      { name: "Red onion",              amount: "½, paper thin — soaked in ice water", img: "images/ingredients/red-onion.png" },
      { name: "Shallot",                amount: "1, thinly sliced",              img: "images/ingredients/shallot.png" },
      { name: "Greek feta block",       amount: "6 oz, hand crumbled",           img: "images/ingredients/feta.png" },
      { name: "Fresh mint",             amount: "1 small bunch, leaves picked",  img: "images/ingredients/mint.png" },
      { name: "Finishing olive oil",    amount: "2 tbsp",                        img: "images/ingredients/olive-oil.png" },
      { name: "Lime",                   amount: "juice of ½",                    img: "images/ingredients/lime.png" },
      { name: "Maldon flaky salt",      amount: "generous pinch",                img: "images/ingredients/salt.png" },
    ],
    steps: [
      { section: "Prep" },
      { text: "Slice your red onion paper thin. Submerge in a bowl of ice water for 10 minutes — this mellows out the sharp bite without losing the flavor. Drain completely and pat dry." },
      { text: "Cut your watermelon into 1.5-inch cubes. Remove any seeds. Be generous — you want a full, abundant platter." },
      { section: "Build" },
      { text: "Build the salad in layers on a large platter. Start with the watermelon as the base. Scatter the cucumber rounds evenly over the top. Add the drained red onion and sliced shallot." },
      { text: "Take your feta block and hand crumble it generously over everything in big chunky pieces — do not use pre-crumbled feta, you want real texture here." },
      { text: "Scatter the torn fresh mint leaves over the top." },
      { section: "Dress & Serve" },
      { text: "Drizzle 2 tbsp of your best finishing olive oil evenly over the whole platter. Squeeze half a lime over everything. Finish with a generous pinch of Maldon flaky salt." },
      { text: "Do not toss. The layers are the whole point — every scoop should get a little of everything. Serve immediately or within 30 minutes max — watermelon weeps fast and you don't want a soggy platter." },
    ],
  },
];

function RecipeBookPage({ setPage }) {
  const [openRecipe, setOpenRecipe] = useStateP(null);
  const [tab, setTab] = useStateP("ingredients");
  const openDetail = (r) => { setOpenRecipe(r); setTab("ingredients"); };
  return (
    <div className="page">
      <section className="book-hero">
        <div className="book-hero-img">
          <img src="images/book-hero.jpg" alt="Clint Hall" style={{width:"100%",height:"100%",objectFit:"cover",objectPosition:"center top",display:"block"}}/>
        </div>
        <div className="book-hero-info">
          <div className="book-meta">
            <span>Vol. 01 · A Working Notebook</span>
            <span>2026</span>
          </div>
          <div className="eyebrow"><span className="dot"></span>The Recipes</div>
          <h1 className="book-title">Cook the<br/>way I <span className="it">actually</span><br/>cook.</h1>
          <p className="book-desc">A growing notebook of the dishes I make on repeat — pulled straight from my kitchen, my Instagram saves, and the dinners my friends won't stop asking about. Free to read, written like a cookbook.</p>
          <div className="cluster">
            <a href="#recipes" className="btn">Browse Recipes <Icon.arrowLg className="arrow"/></a>
            <a href="#" onClick={(e) => { e.preventDefault(); setPage && setPage("subscribe"); }} className="btn ghost">Subscribe — from $3.99/mo</a>
          </div>
          <div className="book-stats">
            <div className="stat"><span className="num">31</span><span className="lbl">Recipes</span></div>
            <div className="stat"><span className="num">∞</span><span className="lbl">Re-cooks</span></div>
            <div className="stat"><span className="num">$0</span><span className="lbl">To read</span></div>
          </div>
        </div>
      </section>

      <Ticker items={["31 Recipes", "Free to Read", "Updated Often", "Made in NYC", "Vol. 01"]}/>

      <section id="recipes" className="container section">
        <div className="section-head">
          <div>
            <div className="eyebrow"><span className="dot"></span>The Index</div>
            <h2 className="section-title">A few of my <span className="it">favorites.</span></h2>
          </div>
          <p className="section-lede">Six pulled from the index — the ones I'd hand a friend if they asked where to start.</p>
        </div>

        <div className="recipe-grid">
          {RECIPES.map((r, i) => (
            <div key={i} className={"recipe" + (r.steps ? " recipe--clickable" : "")}
                 onClick={r.steps ? () => openDetail(r) : undefined}>
              <div className="recipe-img">
                {(r.imgs || r.img)
                  ? <img src={r.imgs ? r.imgs[0] : r.img} alt={r.name} style={{width:"100%",height:"100%",objectFit:"cover",display:"block"}}/>
                  : <image-slot id={"recipe-" + r.n} placeholder={r.name}></image-slot>
                }
              </div>
              <span className="recipe-num">№ {r.n}</span>
              <h3 className="recipe-name">{r.name}</h3>
              <div className="recipe-tags">
                {r.tags.map((t, j) => <span key={j} className="recipe-tag">{t}</span>)}
                {r.steps && <span className="recipe-tag recipe-tag--cta">Read Recipe →</span>}
              </div>
            </div>
          ))}
        </div>
      </section>

      <div className={"modal-bg" + (openRecipe ? " open" : "")} onClick={() => setOpenRecipe(null)}>
        {openRecipe && (
          <div className="modal recipe-modal" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setOpenRecipe(null)}><Icon.close/></button>
            <div className="modal-img recipe-modal-img">
              {openRecipe.imgs
                ? openRecipe.imgs.map((src, i) => (
                    <img key={i} src={src} alt={openRecipe.name}
                      style={{width:"100%",height: openRecipe.imgs.length > 1 ? "50%" : "100%",objectFit:"cover",display:"block"}}/>
                  ))
                : <img src={openRecipe.img} alt={openRecipe.name} style={{width:"100%",height:"100%",objectFit:"cover",display:"block"}}/>
              }
            </div>
            <div className="modal-info recipe-modal-info">
              <div className="eyebrow"><span className="dot"></span>{openRecipe.tags.join(" · ")}{openRecipe.serves && <span style={{marginLeft:12}}>Serves {openRecipe.serves}</span>}</div>
              <h2 style={{fontFamily:"var(--display)",fontSize:"clamp(22px,3vw,36px)",lineHeight:1.05,letterSpacing:"-0.03em",fontWeight:800,textTransform:"uppercase",margin:"6px 0 0"}}>
                {openRecipe.name}
              </h2>

              {openRecipe.ingredients && (
                <div className="recipe-tabs">
                  <button className={"recipe-tab" + (tab === "ingredients" ? " active" : "")} onClick={() => setTab("ingredients")}>Ingredients</button>
                  <button className={"recipe-tab" + (tab === "method" ? " active" : "")} onClick={() => setTab("method")}>Method</button>
                </div>
              )}

              {tab === "ingredients" && openRecipe.ingredients && (
                <ul className="recipe-ing-list">
                  {openRecipe.ingredients.map((ing, i) =>
                    ing.section
                      ? <li key={i} className="recipe-ing-section">{ing.section}</li>
                      : <li key={i} className="recipe-ing-item">
                          <div className="ing-img-wrap">
                            <img src={ing.img} alt={ing.name} className="ing-img"/>
                          </div>
                          <span className="ing-name">{ing.name}</span>
                          <span className="ing-amount">{ing.amount}</span>
                        </li>
                  )}
                </ul>
              )}

              {(tab === "method" || !openRecipe.ingredients) && (
                <ol className="recipe-steps">
                  {(() => {
                    let n = 0;
                    return openRecipe.steps.map((step, i) => {
                      if (step.section) return <div key={i} className="recipe-step-section">{step.section}</div>;
                      n++;
                      return (
                        <li key={i}>
                          <span className="recipe-step-num">Step {n}</span>
                          <span className="recipe-step-text">{step.text || step}</span>
                        </li>
                      );
                    });
                  })()}
                </ol>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

/* ============ SHOP ============ */
const PRODUCTS = [
  { id: "p1", name: "Selvedge Denim Apron",    cat: "Aprons", price: "—", tag: "Coming Soon" },
  { id: "p2", name: "Selvedge Denim Knife Roll", cat: "Tools",  price: "—", tag: "Coming Soon" },
  { id: "p3", name: "Chef Denim",               cat: "Denim",  price: "—", tag: "Coming Soon" },
];

function ShopPage() {
  const [open, setOpen] = useStateP(null);
  const [filter, setFilter] = useStateP("All");
  const cats = ["All", "Aprons", "Denim", "Tools", "Apparel", "Essentials"];
  const items = filter === "All" ? PRODUCTS : PRODUCTS.filter((p) => p.cat === filter);

  return (
    <div className="page">
      <section className="container" style={{ paddingTop: 60 }}>
        <div className="section-head" style={{ marginBottom: 24 }}>
          <div>
            <div className="eyebrow"><span className="dot"></span>The Goods</div>
            <h2 className="section-title">Shop.</h2>
          </div>
          <p className="section-lede">A small line of things I actually wear and use in the kitchen. Made in small runs, built to last.</p>
        </div>

        <div className="cluster" style={{ borderTop: "1px solid var(--rule)", borderBottom: "1px solid var(--rule)", padding: "16px 0", margin: "24px 0 56px", justifyContent: "space-between" }}>
          <div className="cluster" style={{ gap: 8 }}>
            {cats.map((c) => (
              <button key={c} className={"form pill" + (filter === c ? " active" : "")}
                style={{ display: "inline-block", padding: "8px 14px", border: "1px solid var(--rule)", background: filter === c ? "var(--ink)" : "transparent", color: filter === c ? "var(--cream)" : "var(--ink)", borderRadius: 100, fontSize: 12, letterSpacing: ".06em" }}
                onClick={() => setFilter(c)}>{c}</button>
            ))}
          </div>
          <span className="eyebrow">{items.length} items</span>
        </div>

        <div className="shop-grid">
          {items.map((p) => (
            <div key={p.id} className="product" onClick={() => setOpen(p)}>
              <div className="product-img">
                <div className="product-tag-row">
                  {p.tag && <span className={"product-tag" + (p.tag === "Limited" ? " alt" : "")}>{p.tag}</span>}
                  <span></span>
                </div>
                <span className="quick">Quick View</span>
                <image-slot id={p.id} placeholder={p.name}></image-slot>
              </div>
              <span className="product-cat">{p.cat}</span>
              <div className="product-meta">
                <h3 className="product-name">{p.name}</h3>
                <span className="product-price">{p.price}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      <div className={"modal-bg" + (open ? " open" : "")} onClick={() => setOpen(null)}>
        {open && (
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setOpen(null)}><Icon.close/></button>
            <div className="modal-img">
              <image-slot id={"modal-" + open.id} placeholder={open.name}></image-slot>
            </div>
            <div className="modal-info">
              <div className="eyebrow"><span className="dot"></span>{open.cat}</div>
              <h2 className="section-title" style={{ fontSize: 44, lineHeight: 1 }}>{open.name}</h2>
              <p style={{ color: "var(--ink-2)", lineHeight: 1.6, fontSize: 16 }}>
                Cut from heavyweight cotton canvas with double-stitched seams and reinforced straps. Designed to take heat, oil, and the occasional knife slip. Pre-washed for softness; gets better with age.
              </p>
              <div className="cluster" style={{ marginTop: 8 }}>
                {["XS","S","M","L","XL"].map((s, i) => (
                  <button key={s} className="pill" style={{ padding: "10px 16px", border: "1px solid var(--rule)", background: i === 2 ? "var(--ink)" : "transparent", color: i === 2 ? "var(--cream)" : "var(--ink)", borderRadius: 4, fontSize: 13 }}>{s}</button>
                ))}
              </div>
              <div className="cluster" style={{ justifyContent: "space-between", marginTop: "auto", paddingTop: 24, borderTop: "1px solid var(--rule)" }}>
                <span className="book-price" style={{ fontSize: 28 }}>{open.price}</span>
                <a href="#" className="btn">Add to Bag <Icon.arrow className="arrow"/></a>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

/* ============ ABOUT ============ */
function AboutPage({ setPage }) {
  const go = (p) => (e) => { e.preventDefault(); setPage(p); window.scrollTo({ top: 0, behavior: "instant" }); };
  return (
    <div className="page">
      <section className="container">
        <div className="about-hero">
          <div>
            <div className="eyebrow" style={{ marginBottom: 16 }}><span className="dot"></span>About</div>
            <h1>The kid who learned to cook because <span className="it">someone had to.</span></h1>
            <p style={{ fontSize: 18, color: "var(--ink-2)", marginTop: 24, maxWidth: "44ch", lineHeight: 1.5 }}>
              Now a private chef and creator based in New York, sharing recipes, goods, and the long version of the story.
            </p>
          </div>
          <div className="about-hero-img">
            <image-slot id="about-portrait" placeholder="Portrait of Clint"></image-slot>
          </div>
        </div>
      </section>

      <div className="about-strip">
        <div className="cell"><div className="num">9<span className="it">+</span></div><div className="lbl">Years cooking</div></div>
        <div className="cell"><div className="num">31</div><div className="lbl">Recipes published</div></div>
        <div className="cell"><div className="num">2022</div><div className="lbl">Started sharing</div></div>
      </div>

      <section className="container">
        <div className="about-story">
          <aside className="col-meta">
            <div>The Story</div>
            <div style={{ marginTop: 12, fontFamily: "var(--serif)", fontStyle: "italic", fontSize: 28, textTransform: "none", letterSpacing: "-0.01em", color: "var(--ink)" }}>I.</div>
          </aside>
          <div className="col-body">
            <p>It wasn't a passion thing at first. It was a logistics thing. My mom went back to school to become a teacher, my sisters and I were home, and somebody had to make dinner. So we figured it out.</p>
            <p>I leaned hard on YouTube and old cookbooks — that part's still true, it's how I learn most of what I make. Burnt rice, oversalted everything, the works. Eventually I made an omelette I actually liked and something clicked.</p>
            <p>Then high school happened. My friends and I would smoke, get hungry, and I'd just <span className="pull">start cooking for everyone.</span> They couldn't believe it was good. My family loved my food, I loved theirs back, and the more I watched people get happy from a plate I'd put down, the more I knew this was the thing.</p>
            <p>In 2022 my friends finally talked me into posting it online. Now there are private dinners, a few hundred thousand of you watching, and whatever else feels right next.</p>
            <p>This site's the home for all of it. Less feed, more shelf.</p>
          </div>
        </div>
      </section>

      <section className="container">
        <div className="about-gallery">
          <div className="g a"><image-slot id="g1" placeholder="Hero kitchen shot"></image-slot></div>
          <div className="g b"><image-slot id="g2" placeholder="Detail — herbs"></image-slot></div>
          <div className="g c"><image-slot id="g3" placeholder="Detail — knife"></image-slot></div>
          <div className="g d"><image-slot id="g4" placeholder="Plated dish"></image-slot></div>
          <div className="g e"><image-slot id="g5" placeholder="Behind the scenes"></image-slot></div>
        </div>
      </section>

      <section className="container section" style={{ paddingTop: 0 }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: 24, padding: "clamp(40px, 6vw, 80px)", background: "var(--cream-2)", textAlign: "center" }}>
          <div className="eyebrow" style={{ justifySelf: "center" }}><span className="dot"></span>Find me</div>
          <h3 className="section-title" style={{ fontSize: "clamp(36px, 5vw, 64px)", maxWidth: "20ch", margin: "0 auto" }}>Most days I'm <span className="it">somewhere here.</span></h3>
          <div className="cluster" style={{ justifyContent: "center", gap: 12, marginTop: 16 }}>
            <a href="#" className="social-bar" style={{ display: "inline-flex" }}><Icon.ig/> @clintyurr</a>
            <a href="#" className="social-bar" style={{ display: "inline-flex" }}><Icon.yt/> @ClintYur</a>
            <a href="#" className="social-bar" style={{ display: "inline-flex" }}><Icon.tt/> @clintyurrrr</a>
          </div>
          <a href="#" onClick={go("contact")} className="link-arrow" style={{ alignSelf: "center", marginTop: 16 }}>Or work with me <Icon.arrow className="arrow"/></a>
        </div>
      </section>
    </div>
  );
}

/* ============ CONTACT ============ */
function ContactPage() {
  const [mode, setMode] = useStateP("Private Dinner");
  const [sent, setSent] = useStateP(false);
  const submit = (e) => { e.preventDefault(); setSent(true); };
  return (
    <div className="page">
      <section className="container">
        <div className="contact-wrap">
          <div className="contact-info">
            <div className="eyebrow" style={{ marginBottom: 16 }}><span className="dot"></span>Get in touch</div>
            <h1>Let's <span className="it">cook</span> something.</h1>
            <p>Available for private dinners in New York and select destinations — plus brand collaborations, editorial, and consulting. Drop a note and I'll get back within 48 hours.</p>
            <div className="contact-modes">
              <div className="mode">
                <span className="mode-name"><span className="it">Private</span> dinners</span>
                <span className="mode-meta">From $1,200<br/>Intimate · Events</span>
              </div>
              <div className="mode">
                <span className="mode-name">Brand <span className="it">collabs</span></span>
                <span className="mode-meta">Editorial · Recipe Dev<br/>Content</span>
              </div>
              <div className="mode">
                <span className="mode-name"><span className="it">Press</span> & speaking</span>
                <span className="mode-meta">Interviews · Panels<br/>Demos</span>
              </div>
            </div>
            <div className="cluster" style={{ marginTop: 32, gap: 12 }}>
              <a href="#" className="social-bar" style={{ display: "inline-flex" }}><Icon.ig/> @clintyurr</a>
              <a href="#" className="social-bar" style={{ display: "inline-flex" }}><Icon.yt/> @ClintYur</a>
            </div>
          </div>

          <form className="form" onSubmit={submit}>
            <div className="field">
              <label>What is this about?</label>
              <div className="pill-row">
                {["Private Dinner", "Brand Collab", "Press", "Other"].map((m) => (
                  <button key={m} type="button" className={"pill" + (mode === m ? " active" : "")} onClick={() => setMode(m)}>{m}</button>
                ))}
              </div>
            </div>
            <div className="field-grid">
              <div className="field">
                <label>Name</label>
                <input type="text" placeholder="Your name"/>
              </div>
              <div className="field">
                <label>Email</label>
                <input type="email" placeholder="you@email.com"/>
              </div>
            </div>
            {mode === "Private Dinner" && (
              <div className="field-grid">
                <div className="field">
                  <label>Date</label>
                  <input type="text" placeholder="When?"/>
                </div>
                <div className="field">
                  <label>Guests</label>
                  <input type="text" placeholder="How many?"/>
                </div>
              </div>
            )}
            <div className="field">
              <label>Tell me more</label>
              <textarea rows="4" placeholder="The vibe, the menu, the dream dinner…"></textarea>
            </div>
            <div className="submit-row">
              <span className="eyebrow">{sent ? "Sent — talk soon." : "We'll be in touch within 48h"}</span>
              <button type="submit" className="btn" disabled={sent}>
                {sent ? "Sent ✓" : <>Send Note <Icon.arrow className="arrow"/></>}
              </button>
            </div>
          </form>
        </div>
      </section>
    </div>
  );
}

// ─── STRIPE PAYMENT LINKS ────────────────────────────────────────────────────
// Paste your Stripe Payment Link URLs here once created
const STRIPE_MONTHLY = "https://buy.stripe.com/REPLACE_MONTHLY";
const STRIPE_ANNUAL  = "https://buy.stripe.com/REPLACE_ANNUAL";
// ─────────────────────────────────────────────────────────────────────────────

function SubscribePage({ setPage }) {
  const [hover, setHover] = useStateP(null);
  return (
    <div className="page">

      {/* Hero */}
      <section className="sub-hero">
        <div className="sub-hero-inner">
          <div className="eyebrow"><span className="dot"></span>The Recipe Stash</div>
          <h1 className="sub-heading">Cook like yur<br/><span className="it">in on it.</span></h1>
          <p className="sub-lede">Every recipe. Every technique. Every note from the kitchen — unlocked and readable like a real cookbook, not a blog.</p>
        </div>
      </section>

      {/* Pricing cards */}
      <section className="sub-pricing">
        <div className="sub-cards">

          {/* Monthly */}
          <div className={"sub-card" + (hover === "monthly" ? " sub-card--hover" : "")}
            onMouseEnter={() => setHover("monthly")} onMouseLeave={() => setHover(null)}>
            <div className="sub-card-top">
              <span className="sub-plan">Monthly</span>
            </div>
            <div className="sub-price">
              <span className="sub-amount">$7.99</span>
              <span className="sub-period">/ month</span>
            </div>
            <ul className="sub-features">
              <li>Full access to every recipe</li>
              <li>New recipes added regularly</li>
              <li>Ingredients, method & plating notes</li>
              <li>Cancel anytime</li>
            </ul>
            <a href={STRIPE_MONTHLY} className="sub-btn sub-btn--outline">Get Monthly</a>
          </div>

          {/* Annual */}
          <div className={"sub-card sub-card--featured" + (hover === "annual" ? " sub-card--hover" : "")}
            onMouseEnter={() => setHover("annual")} onMouseLeave={() => setHover(null)}>
            <div className="sub-card-top">
              <span className="sub-plan">Annual</span>
              <span className="sub-badge">50% off</span>
            </div>
            <div className="sub-price">
              <span className="sub-amount">$47.94</span>
              <span className="sub-period">/ year</span>
            </div>
            <div className="sub-monthly-eq">$3.99 / month — best value</div>
            <ul className="sub-features">
              <li>Everything in Monthly</li>
              <li>50% savings vs monthly</li>
              <li>Priority access to new drops</li>
              <li>Lock in yur rate forever</li>
            </ul>
            <a href={STRIPE_ANNUAL} className="sub-btn sub-btn--filled">Get Annual</a>
          </div>

        </div>

        <p className="sub-fine">Billed securely through Stripe. Cancel anytime — no questions asked.</p>
      </section>

      {/* What's inside */}
      <section className="sub-inside">
        <div className="sub-inside-inner">
          <h2 className="section-title">What's <span className="it">inside.</span></h2>
          <div className="sub-grid">
            <div className="sub-item">
              <span className="sub-item-num">10+</span>
              <span className="sub-item-label">Recipes live now</span>
            </div>
            <div className="sub-item">
              <span className="sub-item-num">Vol. 01</span>
              <span className="sub-item-label">Working notebook</span>
            </div>
            <div className="sub-item">
              <span className="sub-item-num">Free</span>
              <span className="sub-item-label">To cancel anytime</span>
            </div>
            <div className="sub-item">
              <span className="sub-item-num">Real</span>
              <span className="sub-item-label">Recipes I actually cook</span>
            </div>
          </div>
        </div>
      </section>

      {/* Back */}
      <section style={{ padding: "40px var(--gutter)", borderTop: "1px solid var(--rule)" }}>
        <button className="btn-ghost" onClick={() => setPage("recipe")} style={{ display: "flex", alignItems: "center", gap: 8, background: "none", border: "none", cursor: "pointer", color: "var(--ink)", fontSize: 14, letterSpacing: ".06em", textTransform: "uppercase" }}>
          ← Back to Recipe Stash
        </button>
      </section>

    </div>
  );
}

Object.assign(window, { HomePage, RecipeBookPage, ShopPage, AboutPage, ContactPage, SubscribePage });
