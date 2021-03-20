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

export const deleteAlias = async (indexName, aliasName) => {
    await axios({
        method: 'DELETE',
        url: `${elasticSearchHost}/${indexName}/_alias/${aliasName}`,
    });
}

export const loadRecord = async (data, indexName) => {
    try {
        console.log('loading data to', indexName);
        await axios({
            method: 'POST',
            url: `${elasticSearchHost}/${indexName}/_doc`,
            data,
        });
    } catch (error) {
        console.log(error.response);
    }
};

export const removeOldAliases = async (aliasName, indexPrefix) => {
    try {
        const aliases = await axios({
            method: 'GET',
            url: `${elasticSearchHost}/${aliasName}/_alias`,
        });

        const matches = Object.keys(aliases.data)
            .filter(a => a.startsWith(indexPrefix))
            .sort((a,b) => parseInt(a.replace(indexPrefix, '')) - parseInt(b.replace(indexPrefix, '')));

        for(let i=0; i<matches.length - 1; i++) {
            console.log('deleting alias for ', matches[i]);
            await deleteAlias(matches[i], aliasName);
        }
    } catch (error) {
        console.log(error.response);
    }        
}

