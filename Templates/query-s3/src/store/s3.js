import { S3 } from "@aws-sdk/client-s3";
import { Upload } from "@aws-sdk/lib-storage";

function getS3ListData(data, curBucket) {
  const { plat, bucket, region } = curBucket;
  return {
    prefixes: (data.CommonPrefixes || []).map((it) => it.Prefix),
    objects: (data.Contents || []).map((it) => {
      let src = "";
      let url = "";
      const key = encodeURI(it.Key);
      if (plat == "4everland") {
        src = `https://${bucket}.4everland.store/${key}`;
      } else if (plat == "cos") {
        url = `https://${bucket}.cos.${region}.myqcloud.com/${key}`;
      }
      const arr = it.Key.split(".");
      return {
        etag: it.ETag,
        name: it.Key,
        size: it.Size,
        lastModified:
          typeof it.LastModified == "string"
            ? it.LastModified
            : it.LastModified.toISO8String(),
        src,
        url,
        type: arr[arr.length - 1],
      };
    }),
    nextMarker: data.NextContinuationToken || data.NextMarker,
  };
}
export default {
  namespaced: true,
  actions: {
    async getClient(_, opts) {
      const { type, plat } = opts;
      if (type == "s3") {
        const { accessKeyId, secretAccessKey } = opts;
        let endpoint =
          plat == "4everland" ? "https://endpoint.4everland.co" : "";
        return new S3({
          endpoint,
          signatureVersion: "v2",
          s3ForcePathStyle: true,
          region: "eu-west-2",
          credentials: {
            accessKeyId,
            secretAccessKey,
          },
        });
      }
    },
    async getList({ rootState }, params) {
      const { client, curBucket } = rootState;
      const { type, bucket } = curBucket;
      const Prefix = params.prefix || "";
      if (type == "s3") {
        return client
          .listObjectsV2({
            Bucket: bucket,
            Delimiter: params.delimiter,
            MaxKeys: params["max-keys"],
            Prefix,
            ContinuationToken: params.marker,
          })
          .then((data) => {
            // console.log(data);
            return getS3ListData(data, curBucket);
          });
      }
    },
    async multipartUpload({ rootState }, opts) {
      const { client, curBucket } = rootState;
      const { type, bucket } = curBucket;
      const { name, file, opt } = opts;
      if (type == "s3") {
        const params = {
          Bucket: bucket,
          Key: name,
          Body: file,
          ContentType: file.type,
        };
        const task = new Upload({
          client,
          // queueSize: 3,
          params,
        });
        task.on("httpUploadProgress", (e) => {
          const p = e.loaded / e.total;
          opt.progress(p);
        });
        await task.done();
        return;
      }
    },
    delete({ rootState }, Key) {
      const { client, curBucket } = rootState;
      const { type, bucket } = curBucket;
      if (type == "s3") {
        const params = {
          Bucket: bucket,
          Delete: {
            Objects: [{ Key }],
          },
        };
        return client.deleteObjects(params);
      }
    },
    copy({ rootState }, opts) {
      const { client, curBucket } = rootState;
      const { type, bucket } = curBucket;
      const { Key, srcKey } = opts;
      if (type == "s3") {
        return client.copyObject({
          Bucket: bucket,
          CopySource: encodeURIComponent(bucket + "/" + srcKey),
          Key,
        });
      }
    },
    signatureUrl({ rootState }, opts) {
      const { client } = rootState;
      const { name, opt } = opts;
      return client.signatureUrl(name, opt);
    },
    headObject({ rootState }, Key) {
      const { client, curBucket } = rootState;
      const { type, bucket } = curBucket;
      if (type == "s3") {
        return client
          .headObject({
            Bucket: bucket,
            Key,
          })
          .then((data) => {
            return {
              headers: {
                "content-type": data.ContentType,
              },
            };
          });
      }
    },
  },
};
