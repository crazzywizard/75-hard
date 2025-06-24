# 75 Hard Tracker

A Progressive Web App (PWA) for tracking participants' progress in the 75 Hard challenge. Built with Next.js, TypeScript, and Tailwind CSS.

## Features

### 🎯 Challenge Tracking
- **Daily Entry Management**: Track daily progress with customizable fields
- **Multiple Participants**: Support for multiple participants in the same challenge
- **75-Day Streak**: Automatic tracking of consecutive days completed
- **Weight Tracking**: Record starting and ending weights (end weight only available after 75 days)

### 📱 Progressive Web App
- **Installable**: Add to home screen on mobile and desktop devices
- **Offline Capable**: Works without internet connection
- **Responsive Design**: Optimized for all screen sizes
- **Native App Feel**: Smooth animations and intuitive interface

### 🎨 User Interface
- **Dark/Light Mode**: Toggle between themes
- **Mobile-First Design**: Card layout on mobile, table layout on desktop
- **Real-time Updates**: Instant feedback on data changes
- **Edit Mode**: Inline editing for today's entries only

### 📊 Daily Tracking Fields
- **No Sugar**: Checkbox to track sugar-free days
- **No Eating Out**: Checkbox to track home-cooked meals
- **Calories Burned**: Numeric input for daily calorie burn
- **Steps**: Daily step count tracking
- **Notes**: Optional text field for additional notes

## Tech Stack

- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Database**: Supabase (PostgreSQL)
- **PWA**: next-pwa
- **Icons**: Custom SVG icons
- **Deployment**: Vercel-ready

## Getting Started

### Prerequisites

- Node.js 18+ 
- Yarn or npm
- Supabase account (for database)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd 75-hard-tracker
   ```

2. **Install dependencies**
   ```bash
   yarn install
   # or
   npm install
   ```

3. **Set up environment variables**
   Create a `.env.local` file in the root directory:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

4. **Set up Supabase database**
   - Create a new Supabase project
   - Create the following tables:

   **participants table:**
   ```sql
   CREATE TABLE participants (
     id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
     name TEXT NOT NULL,
     start_weight DECIMAL,
     end_weight DECIMAL,
     start_date DATE NOT NULL,
     created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
   );
   ```

   **entries table:**
   ```sql
   CREATE TABLE entries (
     id SERIAL PRIMARY KEY,
     participant_id UUID REFERENCES participants(id) ON DELETE CASCADE,
     date DATE NOT NULL,
     no_sugar BOOLEAN DEFAULT false,
     no_eating_out BOOLEAN DEFAULT false,
     calories_burned INTEGER DEFAULT 0,
     steps INTEGER DEFAULT 0,
     notes TEXT,
     created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
     UNIQUE(participant_id, date)
   );
   ```

5. **Run the development server**
   ```bash
   yarn dev
   # or
   npm run dev
   ```

6. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## Usage

### Adding Participants
1. Click "Add Participant" button
2. Enter participant name and starting weight
3. Select start date for the challenge
4. Click "Add Participant"

### Daily Tracking
1. Select a participant from the dropdown
2. Fill out the "Add Today's Entry" form with:
   - No Sugar checkbox
   - No Eating Out checkbox
   - Calories burned
   - Steps taken
   - Optional notes
3. Click "Add Entry"

### Editing Entries
- Only today's entry can be edited
- Click "Update" to enter edit mode
- Make changes and click "Save"
- Click "Cancel" to discard changes

### Viewing Progress
- **Entries Table**: View all entries in chronological order
- **Stats Display**: See current streak and completion percentage
- **Rules Display**: Reference the 75 Hard challenge rules
- **Prize Display**: View challenge completion status

### PWA Installation
- **Mobile**: Use browser's "Add to Home Screen" option
- **Desktop**: Click the floating install button (appears when installable)
- **Automatic**: Some browsers will show install prompt automatically

## Project Structure

```
75-hard-tracker/
├── src/
│   ├── app/                 # Next.js App Router
│   │   ├── api/            # API routes
│   │   ├── layout.tsx      # Root layout
│   │   └── page.tsx        # Main page
│   ├── components/         # React components
│   │   ├── ui/            # Reusable UI components
│   │   └── providers/     # Context providers
│   └── lib/               # Utility functions
├── public/                # Static assets
│   ├── manifest.json      # PWA manifest
│   └── sw.js             # Service worker
└── package.json          # Dependencies and scripts
```

## Deployment

### Vercel (Recommended)
1. Push your code to GitHub
2. Connect your repository to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy automatically on push

### Other Platforms
The app can be deployed to any platform that supports Next.js:
- Netlify
- Railway
- DigitalOcean App Platform
- AWS Amplify

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

If you encounter any issues or have questions:
1. Check the [Issues](https://github.com/your-repo/issues) page
2. Create a new issue with detailed information
3. Include steps to reproduce the problem

## Acknowledgments

- Built with [Next.js](https://nextjs.org/)
- Styled with [Tailwind CSS](https://tailwindcss.com/)
- Database powered by [Supabase](https://supabase.com/)
- PWA features enabled by [next-pwa](https://github.com/shadowwalker/next-pwa)
