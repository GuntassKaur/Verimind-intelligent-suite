import random

# Initial seed data for typing test - expanded for robust category support
DATASET = {
    "Kids": {
        "Easy": [
            "The cat sat on the mat and looked at the bat.",
            "I love to play in the park with my friends.",
            "Apples are red, bananas are yellow, and grapes are purple.",
            "My dog runs fast and catches the ball.",
            "Fish swim in the blue water all day long."
        ],
        "Medium": [
            "Elephants are very big animals with long trunks and large ears.",
            "The sun shines bright in the sky during the day and the moon comes out at night.",
            "Reading books is a fun way to learn new stories and adventures.",
            "Butterflies start as caterpillars before they grow wings and fly."
        ],
        "Hard": [
            "Photosynthesis is how plants use sunlight to make their own food to grow strong.",
            "The solar system has many planets that orbit around the big, hot sun.",
            "Dinosaurs lived on Earth millions of years ago, long before humans existed."
        ]
    },
    "General Knowledge": {
        "Easy": [
            "Water boils at one hundred degrees Celsius.",
            "The capital of France is Paris.",
            "Gold is a precious yellow metal used in jewelry.",
            "A triangle has three sides and three corners.",
            "The earth has one moon that orbits it."
        ],
        "Medium": [
            "Mount Everest is the highest mountain in the world above sea level.",
            "The Amazon Rainforest produces a significant amount of the world's oxygen.",
            "Diamond is the hardest natural substance found on Earth.",
            "The Great Wall of China is visible from space under certain conditions."
        ],
        "Hard": [
            "The theory of relativity was developed by Albert Einstein in the early 20th century.",
            "In 1969, Apollo 11 was the spaceflight that first landed humans on the Moon.",
            "The human brain contains approximately eighty-six billion neurons connected by synapses."
        ]
    },
    "Science": {
        "Easy": [
            "Plants need water and sunlight to grow.",
            "The earth spins around the sun once every year.",
            "Magnets have a north pole and a south pole.",
            "Ice melts into water when it gets warm."
        ],
        "Medium": [
            "Atoms are the basic building blocks of all matter in the universe.",
            "Gravity is the force that pulls objects towards the center of the Earth.",
            "Chemical reactions can release energy in the form of heat or light.",
            "DNA carries the genetic instructions for the development of all known living organisms."
        ],
        "Hard": [
            "Quantum entanglement is a phenomenon where particles become interlinked and share states instantly.",
            "Mitochondria are known as the powerhouses of the cell because they generate ATP.",
            "Thermodynamics deals with heat, work, and temperature, and their relation to energy and entropy."
        ]
    },
    "Tech": {
        "Easy": [
            "Computers use binary code which consists of zeros and ones.",
            "The internet connects millions of devices around the world.",
            "A mouse is used to click things on a computer screen.",
            "Robots are machines that can do tasks automatically."
        ],
        "Medium": [
            "Artificial intelligence allows machines to learn from data and improve over time.",
            "Cloud computing delivers computing services like storage and servers over the internet.",
            "Cybersecurity is the practice of protecting systems and networks from digital attacks.",
            "Blockchain is a decentralized digital ledger that records transactions across many computers."
        ],
        "Hard": [
            "Machine learning models are computing systems inspired by the structure of biological brains.",
            "Quantum computing uses quantum bits or qubits to perform complex calculations faster than classical computers.",
            "The complexity class P vs NP problem is one of the biggest unsolved problems in computer science."
        ]
    },
    "Cooking": {
        "Easy": [
            "Mix the flour and sugar together in a big bowl.",
            "Bake the cake in the oven for thirty minutes.",
            "Wash your hands before you start cooking food.",
            "Chop the vegetables into small pieces carefully."
        ],
        "Medium": [
            "Sauté the onions and garlic in olive oil until they are soft and translucent.",
            "Marinate the chicken in soy sauce, ginger, and garlic for at least an hour.",
            "Whisk the eggs vigorously until they are light and fluffy before adding to the pan.",
            "Preheat the oven to three hundred and fifty degrees Fahrenheit before baking."
        ],
        "Hard": [
            "Caramelization is the oxidation of sugar, a process used extensively in cooking for the resulting nutty flavor.",
            "Sous-vide is a method of cooking where food is placed in a plastic pouch and cooked in a water bath.",
            "The Maillard reaction is a chemical reaction between amino acids and reducing sugars that gives browned food its flavor."
        ]
    },
    "Music & Art": {
        "Easy": [
            "Red, blue, and yellow are the primary colors.",
            "The piano has black and white keys.",
            "Drums are used to keep the beat in a song.",
            "Artists use brushes to paint on canvas."
        ],
        "Medium": [
            "Mozart was a prolific and influential composer of the Classical era.",
            "Impressionism is a 19th-century art movement characterized by relatively small, thin, yet visible brush strokes.",
            "Jazz music is characterized by swing and blue notes, call and response vocals, and polyrhythms.",
            "Sculpture is the branch of the visual arts that operates in three dimensions."
        ],
        "Hard": [
            "The Renaissance was a fervent period of European cultural, artistic, political, and economic rebirth following the Middle Ages.",
            "Syncopation involves a variety of rhythms which are in some way unexpected which make part or all of a tune or piece of music off-beat.",
            "Abstract expressionism is a post–World War II art movement in American painting, developed in New York in the 1940s."
        ]
    }
}

def get_typing_text(difficulty="Medium", category="General Knowledge"):
    # Normalize inputs
    if category not in DATASET:
        category = "General Knowledge"
    
    # Check if difficulty exists for category, fallback if not
    if difficulty not in DATASET[category]:
        difficulty = "Medium"
        
    options = DATASET[category][difficulty]
    return random.choice(options)
