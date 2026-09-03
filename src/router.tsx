import { Route, Routes } from 'react-router-dom'
import { HomePage } from './pages/HomePage'
import { PlayersPage } from './pages/PlayersPage'
import { PlayerStatsPage } from './pages/PlayerStatsPage'
import { NewSessionPage } from './pages/NewSessionPage'
import { LegBuyInsPage } from './pages/LegBuyInsPage'
import { LegChipCountPage } from './pages/LegChipCountPage'
import { BetweenLegsPage } from './pages/BetweenLegsPage'
import { SessionSummaryPage } from './pages/SessionSummaryPage'
import { RankingsPage } from './pages/RankingsPage'

export function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/players" element={<PlayersPage />} />
      <Route path="/players/:playerId" element={<PlayerStatsPage />} />
      <Route path="/sessions/new" element={<NewSessionPage />} />
      <Route path="/sessions/:sessionId" element={<SessionSummaryPage />} />
      <Route path="/sessions/:sessionId/between-legs" element={<BetweenLegsPage />} />
      <Route path="/sessions/:sessionId/legs/:legId/buy-ins" element={<LegBuyInsPage />} />
      <Route path="/sessions/:sessionId/legs/:legId/chip-count" element={<LegChipCountPage />} />
      <Route path="/rankings" element={<RankingsPage />} />
    </Routes>
  )
}
