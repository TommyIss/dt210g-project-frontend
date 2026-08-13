# Projekt i kursen DT210G, Fördjupad frontend-utveckling

## Filmrecensionsplattform (Frontend)
Denna applikation är frontend-delen av en filmrecensionsplattform utvecklad i React och TypeScript. Syftet är att erbjuda ett modernt, responsivt och användarvänligt gränsnitt där användare kan söka efter filmer, ta del av detaljerad information och skapa egna recensioner. Applikationen är integrerad med The Movie Database (TMDB) API, vilket gör det möjligt att hämta filmdata i realtid och presentera populära titlar, genrer och metadata direkt i gränsnittet. Frontend kommunicerar med ett eget backend-API som hanterar recensioner, gilla-markeringar, autentisering och användarroller. 

### Tekniker och ramverk
Applikationen är byggd med React och TypeScript, vilket ger en komponentbaserad struktur och statisk typning som gör koden mer robust och lättare att underhålla. React Router används för navigering mellan olika vyer, och state hanteras med Reacts inbyggda hooks. Kommunikationen med backend sker via REST-anrop, och all filmdata hämtas från TMDB API med hjälp av en servergenerard Bearer-token. Gränsnittet är responsivt och anpassat för både desktop samt mobila enheter.

### Funktionalitet
Filmdata och filmens detaljsidor är publika och kan ses av alla besökare utan att vara inloggade. Detta gör det möjligt att utforska filmer, läsa metadata och se recensioner direkt. För att kunna skriva egna recensioner, gilla både filmer samt andras recensioner eller hantera sitt konto behöver användaren skapa ett konto och logga in. Autentisering sker via JWT och frontend hanterar användarens session genom lagring av token.
Inloggade användare kan skriva, uppdatera och ta bort sina egna recensioner. Gilla-funktionen är integrerad med backend och uppdateras i realtid, viklet gör att användaren direkt ser förändringar i antalet gilla-markeringar. Administratörer har utökade behörigheter och kan hantera andra användarens recensioner och aktiviteter, vilket skapar en mer komplett och realistisk plattform med tydlig rollhantering.
Filmer kan filtreras baserat på titel eller genre, och varje film presenteras med titel, poster-bild, utgivningsdatum, genrer, antal gilla-markeringar och genomsnittligt betyg baserat på användarrecensioner. I filmens detaljvy visas ytterligare metadata samt alla recensioner kopplade till filmen.

#### Tommy Issa, tois2401