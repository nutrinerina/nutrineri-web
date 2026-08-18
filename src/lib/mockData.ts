export interface Recipe {
  id: string;
  title: string;
  difficulty: "Fácil" | "Media" | "Difícil";
  prepTime: number; // minutes
  imageUrl: string;
  ingredients: string[];
  category: string;
}

export const INGREDIENTS = [
  "Pollo", "Huevo", "Tomate", "Zanahoria", "Zapallito", "Arroz", "Lentejas", "Avena", "Cebolla", "Morrón", "Quinoa", "Palta", "Espinaca", "Cacao", "Almendras", "Banana"
];

export const RECIPES: Recipe[] = [
  {
    id: "1",
    title: "Bowl de quinoa y vegetales",
    difficulty: "Fácil",
    prepTime: 25,
    imageUrl: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?q=80&w=800&auto=format&fit=crop",
    ingredients: ["Quinoa", "Palta", "Tomate", "Zanahoria"],
    category: "Almuerzos"
  },
  {
    id: "2",
    title: "Batido verde energético",
    difficulty: "Fácil",
    prepTime: 10,
    imageUrl: "https://images.unsplash.com/photo-1610832958506-aa56368176cf?q=80&w=800&auto=format&fit=crop",
    ingredients: ["Espinaca", "Banana", "Almendras"],
    category: "Desayunos"
  },
  {
    id: "3",
    title: "Hamburguesas de lentejas y avena",
    difficulty: "Media",
    prepTime: 30,
    imageUrl: "https://images.unsplash.com/photo-1550547660-d9450f859349?q=80&w=800&auto=format&fit=crop",
    ingredients: ["Lentejas", "Avena", "Cebolla", "Morrón"],
    category: "Cenas"
  },
  {
    id: "4",
    title: "Trufas de cacao y avena",
    difficulty: "Fácil",
    prepTime: 15,
    imageUrl: "https://images.unsplash.com/photo-1606312619070-d48b4c652a52?q=80&w=800&auto=format&fit=crop",
    ingredients: ["Avena", "Cacao", "Almendras"],
    category: "Snacks"
  },
  {
    id: "5",
    title: "Revuelto de zapallito y huevo",
    difficulty: "Fácil",
    prepTime: 15,
    imageUrl: "https://images.unsplash.com/photo-1621317763673-10e53a31c50f?q=80&w=800&auto=format&fit=crop",
    ingredients: ["Zapallito", "Huevo", "Cebolla"],
    category: "Cenas"
  },
  {
    id: "6",
    title: "Pollo al horno con zanahorias",
    difficulty: "Fácil",
    prepTime: 45,
    imageUrl: "https://images.unsplash.com/photo-1598514982205-f36b96d1e8d4?q=80&w=800&auto=format&fit=crop",
    ingredients: ["Pollo", "Zanahoria", "Cebolla"],
    category: "Cenas"
  },
  {
    id: "7",
    title: "Ensalada fresca de lentejas",
    difficulty: "Fácil",
    prepTime: 20,
    imageUrl: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?q=80&w=800&auto=format&fit=crop",
    ingredients: ["Lentejas", "Tomate", "Zanahoria", "Cebolla"],
    category: "Almuerzos"
  },
  {
    id: "8",
    title: "Muffins de banana y avena",
    difficulty: "Media",
    prepTime: 35,
    imageUrl: "https://images.unsplash.com/photo-1557925923-33b251dc3296?q=80&w=800&auto=format&fit=crop",
    ingredients: ["Banana", "Avena", "Huevo", "Almendras"],
    category: "Desayunos"
  },
  {
    id: "9",
    title: "Pollo al curry con Arroz",
    difficulty: "Media",
    prepTime: 40,
    imageUrl: "https://images.unsplash.com/photo-1565557623262-b51c2513a641?q=80&w=800&auto=format&fit=crop",
    ingredients: ["Pollo", "Arroz", "Cebolla"],
    category: "Almuerzos"
  },
  {
    id: "10",
    title: "Wok de Arroz, Quinoa y Morrón",
    difficulty: "Fácil",
    prepTime: 20,
    imageUrl: "https://images.unsplash.com/photo-1512058564366-18510be2db19?q=80&w=800&auto=format&fit=crop",
    ingredients: ["Arroz", "Quinoa", "Morrón", "Zapallito"],
    category: "Cenas"
  },
  {
    id: "11",
    title: "Tostadas con Palta y Huevo",
    difficulty: "Fácil",
    prepTime: 10,
    imageUrl: "https://images.unsplash.com/photo-1525351484163-7529414344d8?q=80&w=800&auto=format&fit=crop",
    ingredients: ["Palta", "Huevo", "Tomate"],
    category: "Desayunos"
  },
  {
    id: "12",
    title: "Omelette de Espinaca y Tomate",
    difficulty: "Fácil",
    prepTime: 15,
    imageUrl: "https://images.unsplash.com/photo-1510693206972-df098062cb71?q=80&w=800&auto=format&fit=crop",
    ingredients: ["Espinaca", "Huevo", "Tomate"],
    category: "Cenas"
  },
  {
    id: "13",
    title: "Brownie saludable de Cacao y Banana",
    difficulty: "Media",
    prepTime: 35,
    imageUrl: "https://images.unsplash.com/photo-1587314168485-3236d6710814?q=80&w=800&auto=format&fit=crop",
    ingredients: ["Cacao", "Banana", "Avena"],
    category: "Snacks"
  },
  {
    id: "14",
    title: "Bastones de Zapallito al horno",
    difficulty: "Fácil",
    prepTime: 25,
    imageUrl: "https://images.unsplash.com/photo-1485962398705-ef6a13cb1e8b?q=80&w=800&auto=format&fit=crop",
    ingredients: ["Zapallito", "Avena"],
    category: "Guarniciones"
  }
];

export interface Tip {
  id: string;
  title: string;
  summary: string;
  imageUrl: string;
  category: string;
  date: string;
}

export const TIPS: Tip[] = [
  {
    id: "1",
    title: "Cómo armar un plato saludable y completo",
    summary: "Descubrí la proporción ideal de vegetales, proteínas y carbohidratos para mantener tu energía estable durante todo el día sin pasar hambre.",
    imageUrl: "https://images.unsplash.com/photo-1490645935967-10de6ba17061?q=80&w=800&auto=format&fit=crop",
    category: "Hábitos",
    date: "12 Oct 2024"
  },
  {
    id: "2",
    title: "5 claves para mejorar tu hidratación diaria",
    summary: "Tomar agua no tiene por qué ser aburrido. Estrategias simples para alcanzar tus requerimientos hídricos diarios sin esfuerzo.",
    imageUrl: "https://images.unsplash.com/photo-1550345332-09e3ac987658?q=80&w=800&auto=format&fit=crop",
    category: "Bienestar",
    date: "05 Oct 2024"
  },
  {
    id: "3",
    title: "Batch Cooking: Organizá tu semana en 2 horas",
    summary: "El secreto para comer sano cuando no tenés tiempo. Guía paso a paso para cocinar el domingo y disfrutar toda la semana.",
    imageUrl: "https://images.unsplash.com/photo-1466637574441-749b8f19452f?q=80&w=800&auto=format&fit=crop",
    category: "Organización",
    date: "28 Sep 2024"
  },
  {
    id: "4",
    title: "Aprendiendo a leer etiquetas nutricionales",
    summary: "Que no te engañen los paquetes coloridos. Lo que realmente tenés que mirar en el supermercado antes de elegir un producto.",
    imageUrl: "https://images.unsplash.com/photo-1542838132-92c53300491e?q=80&w=800&auto=format&fit=crop",
    category: "Educación",
    date: "15 Sep 2024"
  }
];
