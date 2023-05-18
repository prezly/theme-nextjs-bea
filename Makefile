link-modules:
	echo 'packages:' > pnpm-workspace.yaml
	find linked_modules -type l | xargs -I{} realpath --relative-to=. "./{}/" | xargs -I{} echo "  - \"{}\"" >> pnpm-workspace.yaml
	LINK_MODULES=true pnpm install

unlink-modules:
	rm -f pnpm-workspace.yaml
	rm -rf node_modules/ .next
	git checkout HEAD pnpm-lock.yaml
	pnpm install