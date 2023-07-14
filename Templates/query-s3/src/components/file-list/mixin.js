export default {
  data() {
    return {
      curName: null,
      curMarker: null,
      curRefresh: null,
      curParent: null,
    };
  },
  computed: {
    curPath() {
      if (!this.curParent) return "";
      const { name } = this.curParent.data;
      return name || "/";
    },
    curBucket() {
      return this.$store.state.curBucket;
    },
  },
  watch: {
    curPath(val) {
      this.$setState({
        curPath: val,
      });
    },
  },
  methods: {
    async onRefresh(node) {
      if (!node) return;
      const { data = {} } = node;
      const { name = "" } = data;
      if (this.curRefresh === name) return;
      try {
        this.curRefresh = name;
        const subs = await this.getFiles(name);
        if (this.isCascader) {
          while (node.children.length) {
            node.children.pop();
          }
          this.appendNodes(subs, node);
        } else {
          node.setData({
            ...data,
            subs,
          });
          node.setChecked(false);
          this.onCheck();
        }
      } catch (error) {
        console.log(error);
      }
      this.curRefresh = null;
    },
    async setRefresh(name) {
      const parent = this.curParent;
      await this.onRefresh(parent);
      if (name) {
        const newNode = (parent.children || parent.childNodes).filter(
          (it) => it.data.name == name
        )[0];
        if (newNode) return this.onNode(newNode.data, newNode);
        const info = await this.$store.dispatch("headObject", name);
        if (info && info.status == 200) {
          console.log(info);
          const { headers, requestUrls } = info.res;
          this.onFile({
            name,
            size: headers["content-length"],
            etag: headers["etag"],
            type: headers["content-type"],
            lastModified: new Date(headers["last-modified"]).toISO8String(),
            url: requestUrls[0],
          });
          return;
        }
      }
      this.onFile(null);
    },
    onFile(data) {
      this.curName = data ? data.name : null;
      this.$emit("file", data);
    },
    async onDelete(data) {
      console.log(data);
    },
    onCheckedEmit(dirArr, checkedNodes) {
      dirArr = dirArr.filter((it) => {
        return (
          dirArr.filter((dir) => dir != it && it.startsWith(dir)).length == 0
        );
      });
      const res = checkedNodes
        .map((it) => it.name)
        .filter((name) => {
          if (!name) return false;
          return (
            dirArr.filter((dir) => {
              return name.startsWith(dir);
            }).length == 0
          );
        })
        .concat(dirArr);
      this.$emit("input", res);
    },
    onErr(err) {
      console.log(err);
      this.$message(err.message);
    },
    async getFiles(prefix = "", marker, maxKeys = 30) {
      try {
        const { prefixes, objects, nextMarker } = await this.$store.dispatch(
          "s3/getList",
          {
            prefix,
            delimiter: "/",
            marker,
            "max-keys": maxKeys,
          }
        );
        const res = [
          ...(prefixes || []).map((name) => {
            return {
              name,
              label: name.replace(prefix, "").replace(/\/$/, ""),
              isDir: true,
            };
          }),
          ...(objects || []).map((it) => {
            return {
              ...it,
              label: it.name.replace(prefix, ""),
              leaf: true,
            };
          }),
        ].filter((it) => !!it.label);
        if (nextMarker) {
          res.push({
            marker: nextMarker,
            name: nextMarker + "-after",
            label: "Load More",
            leaf: true,
            next: true,
          });
        }
        return res;
      } catch (error) {
        this.onErr(error);
        throw error;
      }
    },
    async getNode(val) {
      if (this.isCascader) {
        return this.$refs.panel?.getNodeByValue(val);
      }
      return this.$refs.tree?.getNode(val);
    },
    async expandNode(val) {
      const node = await this.getNode(val);
      if (!node) return;
      this.curParent = node;
      if (this.isCascader) {
        const panel = this.$refs.panel;
        panel.lazyLoad(node, () => {
          panel.handleExpand(node);
        });
      }
    },
    async onLoad(node, resolve) {
      // console.log(node);
      if (this.isCascader) {
        if (node && !node.root && !node.hasChildren) return resolve([]);
      }
      if (node.level == 0) {
        resolve([
          {
            label: this.curBucket.bucket,
            name: "",
          },
        ]);
        this.$nextTick(() => {
          this.expandNode("");
        });
        return;
      }
      try {
        const { data } = node;
        const list = await this.getFiles(data ? data.name : "");
        resolve(list);
      } catch (error) {
        resolve([]);
      }
    },
  },
};
