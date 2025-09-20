// This file is a re-exporter for the actual Sidebar component.
// It exists to resolve module resolution ambiguity caused by duplicate files.
// The single source of truth for the Sidebar component is in /components/Sidebar.tsx.
import Sidebar from './components/Sidebar';
export default Sidebar;
