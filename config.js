
/**
 * Create and export configuration variables
 */

// Container for all the environments

const environments = {};

// Staging (Defauilt) environment

environments.staging = {
    'httpPort': 4000,
    'httpsPort': 4001,
    'envName': 'staging'
};

// Production environment

environments.production = {
    'httpPort': 5000,
    'httpsPort': 5001,
    'envName': 'production'

};

// determine which environment was passed as a command line argument
const currentEnvironment = typeof (process.env.NODE_ENV) === 'string' ? process.env.NODE_ENV.toLocaleLowerCase() : '';

// Checkthat the current environment is one of the environments above, if not,
// default to staging
let environmentToExport;
if (typeof (environments[currentEnvironment]) == 'object') {
    environmentToExport = environments[currentEnvironment]
} else {
    environmentToExport = environments.staging;
}

// export module

module.exports = environmentToExport;