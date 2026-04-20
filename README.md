# WasteWise

WasteWise is a waste action router that turns any piece of waste into a clear decision. It instantly tells you what to do with your waste, where to drop it off, or who in your local community might need it.

When people have plastic, e-waste, food scraps, or old clothes, they often do not know what to do. Google gives generic results, and local cities rarely have connected systems. A local cafe might throw away 8 kilograms of organic waste that a nearby farm could use, but they simply never connect. People genuinely care about waste, but they are stuck. 

WasteWise routes the waste instead of just classifying it. It connects households to official infrastructure and brings local reuse networks together. Your organic waste becomes someone else's resource.

## Key Features

1. **Identify waste**: Select your waste type from a simple visual grid (plastic, food, e-waste, paper, metal, hazardous, textile, other).
2. **Action Steps**: Instantly see what to do (recycle, compost, donate, or dispose). You get 4 to 5 numbered steps, a critical CO2 impact stat, and a clear urgency level.
3. **Map and Community Board**: See a map with green pins for official recycling centers and blue pins for people or businesses offering waste for reuse. Check the community board directly to offer your own waste for nearby neighbors or farms to pick up.
4. **Action Plans**: One click PDF downloads of your action plan, plus easy sharing to WhatsApp.

## Project Structure

The project is built as a clean monorepo separating frontend from backend:

```text
wastewise/
  client/                    (React frontend web application)
    src/                     React components, contexts, and pages
    package.json             Frontend dependencies (react-leaflet, jspdf, etc)
    .env.local               Local API configuration pointing to Flask
  
  server/                    (Python Flask backend)
    data/                    JSON files replacing a traditional database
      waste_actions.json     Data for all 8 categories, CO2 impacts, and action steps
      disposal_sites.json    Lat/Lng locations and details for 15 disposal centers
    app.py                   Flask routes handling data delivery
    requirements.txt         Backend dependencies (flask, flask-cors)
```

## Local Setup Instructions

You need two terminal windows to run WasteWise locally. One for the backend API and one for the frontend client.

### 1. Start the Flask Backend

Open your first terminal and run the following commands to install dependencies and start the local API:

```bash
cd wastewise/server
pip install -r requirements.txt
python app.py
```

The Flask server will start up on `http://localhost:5000`.

### 2. Start the React Frontend

Open your second terminal and run the following commands to install Node dependencies and launch the frontend:

```bash
cd wastewise/client
npm install
npm run dev
```

The frontend will be available at `http://localhost:5173`. Open this URL in your browser to explore the WasteWise app.
