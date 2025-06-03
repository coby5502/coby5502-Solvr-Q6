import React, { ReactNode, useState, useEffect } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { 
  HomeIcon, 
  ChartBarIcon, 
  CalendarIcon,
  UserIcon,
  XMarkIcon
} from '@heroicons/react/24/outline'
import moonLogo from '../../assets/moon.svg'

interface MainLayoutProps {
  children: ReactNode
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  const navigate = useNavigate()
  const location = useLocation()
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false)
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768)

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768)
    }

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  const handleLogout = () => {
    navigate('/login')
  }

  const menuItems = [
    { path: '/', icon: HomeIcon, label: '홈' },
    { path: '/records', icon: CalendarIcon, label: '기록' },
    { path: '/analysis', icon: ChartBarIcon, label: '분석' },
    { path: '/profile', icon: UserIcon, label: '프로필' }
  ]

  const profileMenuItems = [
    { label: '프로필 설정', onClick: () => navigate('/profile') },
    { label: '로그아웃', onClick: handleLogout }
  ]

  return (
    <div className="h-screen flex flex-col bg-dark-200 text-white">
      {/* Mobile Top Bar */}
      {isMobile && (
        <div className="fixed top-0 left-0 right-0 bg-dark-300 shadow-sm z-50">
          <div className="flex items-center justify-between px-4 py-3">
            <div className="flex items-center space-x-2">
              <img src={moonLogo} alt="Moon Night" className="w-8 h-8" />
              <span className="text-xl font-semibold text-white">Moon Night</span>
            </div>
          </div>
        </div>
      )}

      {/* Desktop Sidebar */}
      {!isMobile && (
        <div className="fixed inset-y-0 left-0 w-64 bg-dark-300 shadow-lg">
          <div className="flex flex-col h-full">
            <div className="flex items-center px-6 py-6">
              <img src={moonLogo} alt="Moon Night" className="w-8 h-8" />
              <span className="ml-2 text-xl font-semibold text-white">Moon Night</span>
            </div>
            <nav className="flex-1 px-4 space-y-1">
              {menuItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center px-4 py-3 text-sm font-medium rounded-md transition-colors duration-150 ${
                    location.pathname === item.path
                      ? 'bg-accent-purple/20 text-accent-purple'
                      : 'text-gray-300 hover:bg-dark-400 hover:text-white'
                  }`}
                >
                  <item.icon className="w-5 h-5 mr-3" />
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className={`flex-1 ${!isMobile ? 'ml-64' : ''} ${isMobile ? 'pt-16 pb-20' : ''} overflow-y-auto bg-dark-200`}>
        <div className="p-6">{children}</div>
      </div>

      {/* Mobile Bottom Navigation */}
      {isMobile && (
        <div className="fixed bottom-0 left-0 right-0 bg-dark-300 border-t border-dark-400 z-50">
          <nav className="flex justify-around">
            {menuItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`flex flex-col items-center py-2 px-3 transition-colors duration-150 ${
                  location.pathname === item.path
                    ? 'text-accent-purple'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                <item.icon className="w-6 h-6" />
                <span className="text-xs mt-1">{item.label}</span>
              </Link>
            ))}
          </nav>
        </div>
      )}

      {/* Profile Menu */}
      {isProfileMenuOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50" onClick={() => setIsProfileMenuOpen(false)}>
          <div className="absolute bottom-0 left-0 right-0 bg-dark-300 rounded-t-2xl p-4" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-white">프로필</h3>
              <button
                onClick={() => setIsProfileMenuOpen(false)}
                className="p-2 rounded-md text-gray-400 hover:text-white"
              >
                <XMarkIcon className="w-6 h-6" />
              </button>
            </div>
            <div className="space-y-2">
              {profileMenuItems.map((item, index) => (
                <button
                  key={index}
                  onClick={() => {
                    item.onClick()
                    setIsProfileMenuOpen(false)
                  }}
                  className="w-full px-4 py-3 text-left text-gray-300 hover:bg-dark-400 hover:text-white rounded-md"
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default MainLayout 