document.getElementById('searchForm').addEventListener('submit', async function(event) {

            event.preventDefault();

            const fileName = document.getElementById('fileName').value;

            const resultsContainer = document.getElementById('results');

            resultsContainer.innerHTML = "Searching...";

            const repoOwner = 'amyssnippet';

            const repoName = 'LeetCode-sols';

            const folderPath = 'solutions';

            const token = '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'; 

            try {

                const response = await fetch(`https://api.github.com/repos/${repoOwner}/${repoName}/git/trees/main?recursive=1`, {

                    headers: {

                        'Authorization': `token ${token}`

                    }

                });

                const data = await response.json();

                if (data.message) {

                    resultsContainer.innerText = `Error: ${data.message}`;

                    return;

                }

                const files = data.tree.filter(item => 

                    item.type === 'blob' && 

                    item.path.startsWith(folderPath) && 

                    item.path.split('/').pop().includes(fileName)

                );

                // Sort files based on numeric values in file names

                files.sort((a, b) => {

                    const aNumber = parseInt(a.path.split('/').pop().match(/\d+/)[0]);

                    const bNumber = parseInt(b.path.split('/').pop().match(/\d+/)[0]);

                    return aNumber - bNumber;

                });

                

                if (files.length > 0) {

                    resultsContainer.innerHTML = ''; // Clear the previous results

                    for (const file of files) {

                        const fileResponse = await fetch(file.url, {

                            headers: {

                                'Accept': 'application/vnd.github.v3.raw',

                                'Authorization': `token ${token}`

                            }

                        });

                        const content = await fileResponse.text();

                        const fileResult = document.createElement('div');

                        fileResult.innerHTML = `<h3> ${file.path}</h3><pre><code>${content}</code></pre>`;

                        resultsContainer.appendChild(fileResult);

                    }

                } else {

                    resultsContainer.innerText = "No matches ";

                }

            } catch (error) {

                console.error('Error:', error);

                resultsContainer.innerText = "An error occurred. Please try again.";

            }

        });
