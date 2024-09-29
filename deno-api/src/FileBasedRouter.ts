const groupByDirectory = <T = unknown>(files: Record<string, T>) =>
{
    const organizedFiles = {} as Record<string, Record<string, T>>
    for (const [path, content] of Object.entries(files))
    {
        const pathParts = path.split('/')
        const fileName = pathParts.pop()
        const directory = pathParts.join('/')
        if (!organizedFiles[directory])
            {organizedFiles[directory] = {}}
        if (fileName)
            {organizedFiles[directory][fileName] = content}
    }

    // Sort the files in each directory
    for (const [directory, files] of Object.entries(organizedFiles))
    {
        const sortedEntries = Object.entries(files).sort(([keyA], [keyB]) =>
        {
            if (keyA[0] === '[' && keyB[0] !== '[')
                {return 1}
            if (keyA[0] !== '[' && keyB[0] === '[')
                {return -1}
            return keyA.localeCompare(keyB)
        })
        organizedFiles[directory] = Object.fromEntries(sortedEntries)
    }
    return organizedFiles
}

function MakeFileBasedRoutes()
{
    const ROUTES =
        import.meta.glob('/app/routes/**/[a-z0-9[-][a-z0-9[_-]*.(ts|tsx|mdx)', {
            eager: true,
        })

    const routesMap = groupByDirectory(ROUTES)
}