const companyStructure = {
  departments: {
    engineering: {
      teams: {
        frontend: {
          members: [
            { id: 1, name: 'Alice', role: 'Lead Developer' },
            { id: 2, name: 'Bob', role: 'Developer' }
          ],
          projects: {
            dashboard: {
              status: 'In Progress',
              features: ['User Management', 'Data Visualization'],
              dependencies: ['Backend API', 'Design System']
            },
            mobileApp: {
              status: 'Planned',
              features: ['Offline Mode', 'Push Notifications']
            }
          }
        },
        backend: {
          members: [
            { id: 3, name: 'Charlie', role: 'Lead Developer' },
            { id: 4, name: 'Diana', role: 'Developer' }
          ],
          projects: {
            authService: {
              status: 'Completed',
              integrations: ['OAuth2', 'JWT']
            }
          }
        }
      }
    },
    sales: {
      regions: {
        northAmerica: {
          managers: [
            { id: 5, name: 'Eve', title: 'Regional Sales Manager' }
          ],
          territories: {
            eastCoast: {
              clients: ['Client A', 'Client B']
            },
            westCoast: {
              clients: ['Client C', 'Client D']
            }
          }
        }
      }
    }
  }
};

const {departments: {engineering:{teams:{frontend:{projects:{dashboard:{features}}}}},sales:{regions:{northAmerica:{managers, territories:{eastCoast,westCoast}}}}}} = companyStructure;

console.log(features);
console.log(managers);
console.log(eastCoast);
console.log(westCoast);