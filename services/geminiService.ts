import { GoogleGenAI, Type } from "@google/genai";
import { ConversionResult } from '../types';

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  throw new Error("API_KEY environment variable not set.");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

const model = "gemini-2.5-flash";

const responseSchema = {
    type: Type.OBJECT,
    properties: {
        phpCode: {
            type: Type.STRING,
            description: "Le code PHP complet, en un seul fichier, qui intègre le HTML et la logique dynamique."
        },
        sqlCode: {
            type: Type.STRING,
            description: "Le schéma SQL (CREATE TABLE) et des exemples d'instructions INSERT nécessaires pour l'application."
        },
        feedback: {
            type: Type.STRING,
            description: "Des commentaires constructifs sur le code généré, formatés en Markdown. Expliquez les changements, les meilleures pratiques et les prochaines étapes."
        }
    },
    required: ["phpCode", "sqlCode", "feedback"]
};

const buildPrompt = (html: string, css: string, userPrompt: string): string => {
  return `
    Vous êtes un développeur web full-stack expert, spécialisé dans la conversion de sites web statiques HTML/CSS en applications dynamiques PHP et SQL.
    Votre tâche est d'analyser le code statique fourni et la demande de l'utilisateur, puis de générer le code dynamique correspondant.

    **Instructions :**
    1.  **Analyser** : Examinez le HTML, le CSS (le cas échéant) fournis par l'utilisateur, ainsi que son objectif de conversion.
    2.  **Générer le PHP** : Créez un fichier PHP unique et bien structuré.
        *   Intégrez la structure HTML d'origine.
        *   Utilisez PHP pour afficher du contenu dynamique en fonction de la demande de l'utilisateur.
        *   Incluez la logique de connexion à la base de données (en utilisant PDO pour la sécurité) avec des identifiants de substitution.
        *   Assurez-vous que le code PHP est sécurisé (par exemple, utilisez des requêtes préparées pour prévenir l'injection SQL).
        *   **Mettez en œuvre une gestion robuste des erreurs** : Encadrez toutes les opérations de base de données (connexion, requêtes) dans des blocs \`try-catch\`. En cas d'échec, affichez un message d'erreur générique et convivial, et utilisez \`error_log()\` pour écrire le message détaillé de la \`PDOException\` dans le journal d'erreurs du serveur pour le débogage.
        *   **Implémentez la gestion des sessions PHP** : Si la demande de l'utilisateur implique un état utilisateur (par exemple, connexion, panier), utilisez \`session_start()\` au début du script. Stockez les données pertinentes dans le tableau \`$_SESSION\`. Assurez la sécurité en régénérant l'ID de session avec \`session_regenerate_id(true)\` après des actions sensibles (par exemple, la connexion).
        *   **Gestion de la création d'utilisateur** : Si la demande de l'utilisateur implique la création de nouveaux utilisateurs (par exemple, un formulaire d'inscription), générez le formulaire HTML correspondant. Dans le code PHP, traitez la soumission du formulaire et assurez-vous de hacher les mots de passe de manière sécurisée à l'aide de \`password_hash()\` avant de les stocker dans la base de données. Ne stockez jamais les mots de passe en texte brut.
        *   **Implémentez la pagination** : Si la demande de l'utilisateur implique l'affichage d'une liste de données (par exemple, des articles de blog, des produits), mettez en œuvre une logique de pagination. Calculez le nombre total de pages, utilisez un paramètre GET (par exemple, \`?page=2\`) pour déterminer la page actuelle, et utilisez \`LIMIT\` et \`OFFSET\` dans votre requête SQL pour ne récupérer que les enregistrements de la page en cours. Générez des liens de navigation pour la pagination (Précédent, Suivant, numéros de page).
        *   Incluez des commentaires clairs pour expliquer les parties clés du code.
    3.  **Générer le SQL** : Créez la ou les instructions SQL \`CREATE TABLE\` nécessaires pour prendre en charge la fonctionnalité dynamique.
        *   Si une table d'utilisateurs est nécessaire, elle doit contenir des colonnes pour un nom d'utilisateur et un hachage de mot de passe, mais PAS pour un mot de passe en texte brut.
        *   Incluez des types de données, des clés primaires et des contraintes appropriés.
        *   Incluez quelques exemples d'instructions \`INSERT\` pour remplir la table avec des données fictives.
    4.  **Fournir des commentaires** : Rédigez une revue concise et constructive du code généré, en utilisant le format **Markdown**.
        *   Utilisez des titres (par exemple, \`## Changements clés\`), des listes à puces (\`*\`) et du code en ligne (\`code\`) pour plus de clarté.
        *   Expliquez les modifications que vous avez apportées pour convertir le site statique en site dynamique.
        *   Mettez en évidence les meilleures pratiques utilisées (par exemple, PDO, requêtes préparées, gestion des erreurs try-catch, gestion sécurisée des sessions, hachage de mot de passe avec \`password_hash()\`, pagination).
        *   Suggérez des améliorations potentielles ou des prochaines étapes pour l'utilisateur.

    **Entrée :**
    -   **Objectif de l'utilisateur :** "${userPrompt}"
    -   **Code HTML :**
        \`\`\`html
        ${html}
        \`\`\`
    -   **Code CSS (si fourni) :**
        \`\`\`css
        ${css || 'Aucun CSS fourni.'}
        \`\`\`

    **Format de sortie :**
    Répondez UNIQUEMENT avec un objet JSON valide qui respecte strictement le schéma défini. N'ajoutez aucun texte supplémentaire, formatage markdown ou explication en dehors de la structure JSON.
  `;
};

export const convertStaticToDynamic = async (
  htmlContent: string,
  cssContent: string,
  prompt: string
): Promise<ConversionResult> => {
  const fullPrompt = buildPrompt(htmlContent, cssContent, prompt);

  try {
    const response = await ai.models.generateContent({
      model: model,
      contents: fullPrompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: responseSchema,
        temperature: 0.2,
      },
    });

    const jsonText = response.text.trim();
    
    // Sometimes the model might wrap the JSON in markdown, so we strip it.
    const sanitizedJsonText = jsonText.replace(/^```json\n?/, '').replace(/\n?```$/, '');

    const parsedResponse = JSON.parse(sanitizedJsonText);
    
    if (!parsedResponse.phpCode || !parsedResponse.sqlCode || !parsedResponse.feedback) {
        throw new Error("Structure de réponse invalide de l'API.");
    }

    return parsedResponse as ConversionResult;

  } catch (error) {
    console.error("Error calling Gemini API:", error);
    throw new Error("Échec de l'obtention d'une réponse valide de l'IA. Veuillez vérifier votre invite ou réessayer.");
  }
};
