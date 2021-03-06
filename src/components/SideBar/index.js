import React, { Fragment } from 'react';
import { Link } from 'react-router-dom';
import User from 'components/User';
import isEmpty from 'lodash/isEmpty';
import SignOut from '../SignOut';
import { SideBarWrapper } from '../../styles/Sidebar';
import Spinner from '../Spinner';

const SideBar = () => (
  <User>
    {({ data, loading, error }) => {
      const { avatar, roles, team } = data.me;
      const { group } = team;
      const rolesArray = roles.map(role => role.name);
      return (
        <Fragment>
          {loading && <Spinner />}
          {error && <div>Error: {error.message}</div>}

          <SideBarWrapper>
            <ul>
              <li>
                <img src={avatar} alt="avatar profile" />
                <Link to="/profile/edit">Edit Profile</Link>
              </li>
              <li>
                <Link to="/reports/new">Create Daily Report</Link>
              </li>
              <li>
                <Link to="/reports">Daily Reports</Link>
              </li>

              {rolesArray.includes('TEAM_LEADER') && (
                <Fragment>
                  <li>
                    <Link to="/weekly-reports/new">Create Weekly Report</Link>
                  </li>

                  {team && !isEmpty(team) && (
                    <Fragment>
                      <li>
                        <Link to={`/teams/${team.id}/reports`}>Team's Daily Reports</Link>
                      </li>
                      <li>
                        <Link to={`/teams/${team.id}/members`}>Team Members List</Link>
                      </li>
                    </Fragment>
                  )}

                  <li>
                    <Link to="/statistic">Statistic</Link>
                  </li>
                </Fragment>
              )}

              {rolesArray.includes('GROUP_LEADER') && (
                <Fragment>
                  <li>
                    <Link to="/projects">Projects List</Link>
                  </li>
                  <li>
                    <Link to="/projects/new">Create Project</Link>
                  </li>
                  <li>
                    <Link to={`/groups/${group.id}/teams`}>Teams Management</Link>
                  </li>
                </Fragment>
              )}
              <li>
                <SignOut />
              </li>
            </ul>
          </SideBarWrapper>
        </Fragment>
      );
    }}
  </User>
);

export default SideBar;
