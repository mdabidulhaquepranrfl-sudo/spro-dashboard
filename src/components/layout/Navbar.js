'use client';

import Image from 'next/image';
import Link from 'next/link';

export default function Navbar() {
  return (
    <nav
      className="layout-navbar container-xxl navbar-detached navbar navbar-expand-xl align-items-center bg-navbar-theme"
      id="layout-navbar"
    >
      {/* Mobile: hamburger to open sidebar */}
      <div className="layout-menu-toggle navbar-nav align-items-xl-center me-4 me-xl-0 d-xl-none">
        <a className="nav-item nav-link px-0 me-xl-6" href="javascript:void(0)" aria-label="Toggle menu">
          <i className="icon-base bx bx-menu icon-md" />
        </a>
      </div>

      <div className="navbar-nav-right d-flex align-items-center justify-content-end" id="navbar-collapse">
        {/* Search */}
        <div className="navbar-nav align-items-center me-auto">
          <div className="nav-item d-flex align-items-center">
            <span className="w-px-22 h-px-22">
              <i className="icon-base bx bx-search icon-md" />
            </span>
            <input
              type="text"
              className="form-control border-0 shadow-none ps-1 ps-sm-2 d-md-block d-none"
              placeholder="Search..."
              aria-label="Search..."
            />
          </div>
        </div>
        {/* /Search */}

        <ul className="navbar-nav flex-row align-items-center ms-md-auto">
          {/* User dropdown */}
          <li className="nav-item navbar-dropdown dropdown-user dropdown">
            <a
              className="nav-link dropdown-toggle hide-arrow p-0"
              href="javascript:void(0);"
              data-bs-toggle="dropdown"
              aria-expanded="false"
              id="navbar-user-dropdown"
            >
              <div className="avatar avatar-online">
                <img
                  src="/assets/img/avatars/1.png"
                  alt="User avatar"
                  className="w-px-40 h-auto rounded-circle"
                  width={40}
                  height={40}
                />
              </div>
            </a>

            <ul className="dropdown-menu dropdown-menu-end" aria-labelledby="navbar-user-dropdown">
              {/* User info */}
              <li>
                <a className="dropdown-item" href="#">
                  <div className="d-flex">
                    <div className="flex-shrink-0 me-3">
                      <div className="avatar avatar-online">
                        <img
                          src="/assets/img/avatars/1.png"
                          alt="User"
                          className="w-px-40 h-auto rounded-circle"
                          width={40}
                          height={40}
                        />
                      </div>
                    </div>
                    <div className="flex-grow-1">
                      <h6 className="mb-0">John Doe</h6>
                      <small className="text-body-secondary">Admin</small>
                    </div>
                  </div>
                </a>
              </li>

              <li><div className="dropdown-divider my-1" /></li>

              <li>
                <a className="dropdown-item" href="#">
                  <i className="icon-base bx bx-user icon-md me-3" />
                  <span>My Profile</span>
                </a>
              </li>
              <li>
                <a className="dropdown-item" href="#">
                  <i className="icon-base bx bx-cog icon-md me-3" />
                  <span>Settings</span>
                </a>
              </li>
              <li>
                <a className="dropdown-item" href="#">
                  <span className="d-flex align-items-center align-middle">
                    <i className="flex-shrink-0 icon-base bx bx-credit-card icon-md me-3" />
                    <span className="flex-grow-1 align-middle">Billing Plan</span>
                    <span className="flex-shrink-0 badge rounded-pill bg-danger">4</span>
                  </span>
                </a>
              </li>

              <li><div className="dropdown-divider my-1" /></li>

              <li>
                <Link className="dropdown-item" href="/login">
                  <i className="icon-base bx bx-power-off icon-md me-3" />
                  <span>Log Out</span>
                </Link>
              </li>
            </ul>
          </li>
          {/* /User dropdown */}
        </ul>
      </div>
    </nav>
  );
}
