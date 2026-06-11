import { NavLink, useLocation, useNavigate } from "react-router-dom"
import { NAV_ITEMS } from "../constants/navigation"
import { useLiquidNav } from "../hooks/useLiquidNav"
import { useStoredWeatherTheme } from "../hooks/useStoredWeatherTheme"

function findActiveIndex(pathname) {
  if (pathname === "/") {
    return 0
  }

  const index = NAV_ITEMS.findIndex(
    (item) => item.path !== "/" && pathname.startsWith(item.path)
  )

  return index === -1 ? 0 : index
}

export function Header() {
  const location = useLocation()
  const navigate = useNavigate()
  const { theme } = useStoredWeatherTheme()
  const activeIndex = findActiveIndex(location.pathname)
  const {
    isDragging,
    itemRefs,
    listRef,
    navEventHandlers,
    thumbStyle,
  } = useLiquidNav({
    activeIndex,
    onNavigateIndex: (nextIndex) => navigate(NAV_ITEMS[nextIndex].path),
  })

  return (
    <header className="sticky top-0 z-30 px-3 pt-3 sm:px-5 sm:pt-5">
      <div className="mx-auto max-w-5xl">
        <div className="liquid-nav-shell" data-mode={theme.mode}>
          <div className="liquid-nav-shell__glow" />

          <nav className="liquid-nav" aria-label="Main navigation">
            <div className="liquid-nav__sheen" />

            <ul
              ref={listRef}
              className={`liquid-nav__list ${
                isDragging ? "liquid-nav__list--dragging" : ""
              }`}
              {...navEventHandlers}
            >
              <li
                aria-hidden="true"
                className={`liquid-nav__thumb ${
                  isDragging ? "liquid-nav__thumb--dragging" : ""
                }`}
                style={{
                  height: `${thumbStyle.height}px`,
                  transform: `translate3d(${thumbStyle.left}px, ${thumbStyle.top}px, 0)`,
                  width: `${thumbStyle.width}px`,
                }}
              >
                <span className="liquid-nav__thumb-sheen" />
              </li>

              {NAV_ITEMS.map((item, index) => (
                <li
                  key={item.path}
                  ref={(element) => {
                    itemRefs.current[index] = element
                  }}
                  className="liquid-nav__item"
                >
                  <NavLink
                    end={item.path === "/"}
                    to={item.path}
                    data-nav-link="true"
                    className={({ isActive }) =>
                      `liquid-nav__link ${isActive ? "liquid-nav__link--active" : ""}`
                    }
                  >
                    <span className="liquid-nav__label liquid-nav__label--desktop">
                      {item.name}
                    </span>
                    <span className="liquid-nav__label liquid-nav__label--mobile">
                      {item.shortName ?? item.name}
                    </span>
                  </NavLink>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </div>
    </header>
  )
}
