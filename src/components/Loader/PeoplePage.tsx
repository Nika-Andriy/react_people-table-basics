import { useEffect, useState } from 'react';
import { Person } from '../../types';
import { Loader } from './Loader';
import { getPeople } from '../../api';
import classNames from 'classnames';
import { useLocation } from 'react-router-dom';
import { PersonLink } from './PersonLink';

export const PeoplePage = () => {
  const [people, setPeople] = useState<Person[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const { pathname } = useLocation();

  useEffect(() => {
    setIsLoading(true);
    setErrorMessage('');

    getPeople()
      .then(peopleFromServer => {
        setPeople(peopleFromServer);
      })
      .catch(() => {
        setErrorMessage('Something went wrong');
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  return (
    <>
      <h1 className="title">People Page</h1>

      <div className="block">
        <div className="box table-container">
          {isLoading && <Loader />}

          {errorMessage && (
            <p data-cy="peopleLoadingError" className="has-text-danger">
              {errorMessage}
            </p>
          )}

          {people.length === 0 && !isLoading && (
            <p data-cy="noPeopleMessage">There are no people on the server</p>
          )}

          {!isLoading && (
            <table
              data-cy="peopleTable"
              className="table is-striped is-hoverable is-narrow is-fullwidth"
            >
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Sex</th>
                  <th>Born</th>
                  <th>Died</th>
                  <th>Mother</th>
                  <th>Father</th>
                </tr>
              </thead>

              <tbody>
                {people.map(person => {
                  const mother = people.find(p => p.name === person.motherName);
                  const father = people.find(p => p.name === person.fatherName);
                  const isSelected = pathname === `/people/${person.slug}`;

                  return (
                    <tr
                      key={person.slug}
                      data-cy="person"
                      className={classNames({
                        'has-background-warning': isSelected,
                      })}
                    >
                      <td>
                        <PersonLink person={person} />
                      </td>

                      <td>{person.sex}</td>
                      <td>{person.born}</td>
                      <td>{person.died}</td>

                      <td>
                        {person.motherName ? (
                          mother ? (
                            <PersonLink person={mother} />
                          ) : (
                            person.motherName
                          )
                        ) : (
                          '-'
                        )}
                      </td>

                      <td>
                        {person.fatherName ? (
                          father ? (
                            <PersonLink person={father} />
                          ) : (
                            person.fatherName
                          )
                        ) : (
                          '-'
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </>
  );
};
