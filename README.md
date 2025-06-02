# bunbuilder

build bun apps

## development

clone

```boo
git clone https://github.com/yassghn/bunbuilder
```

install dependencies

```boo
bun i
```

build & pack

```boo
bun ship
```

## package

create executable

```boo
bun run build
```

create tarball for node dependency

```boo
npm pack
```

```boo
bun add --dev '../path/to/tarball.tgz'
```

run bunbuilder

```boo
bunx bunbuilder
```

update bunbuilder (pulls from original tar path)

```boo
bun update bunbuilder
```

## license
[OUI](/license)