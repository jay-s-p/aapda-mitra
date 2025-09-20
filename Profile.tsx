// This file is a re-exporter for the actual Profile component.
// It exists to resolve module resolution ambiguity caused by duplicate files.
// The single source of truth for the Profile component is in /components/Profile.tsx.
import Profile from './components/Profile';
export default Profile;
