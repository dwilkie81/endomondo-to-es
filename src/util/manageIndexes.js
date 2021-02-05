import axios from 'axios';
import { mappings } from '../mappings';

const elasticSearchHost = 'http://localhost:9200';

export const deleteIndex = async (indexName) => {
    await axios({
        method: 'DELETE',
        url: `${elasticSearchHost}/${indexName}`,
        data: {}
    });
};

export const createIndex = async (indexName) => {
    await axios({
        method: 'PUT',
        url: `${elasticSearchHost}/${indexName}`,
        data: {
            mappings,
        }
    });
};

export const aliasIndex = async (indexName, aliasName) => {
    await axios({
        method: 'PUT',
        url: `${elasticSearchHost}/${indexName}/_alias/${aliasName}`,
        data: {
            mappings,
        }
    });
}