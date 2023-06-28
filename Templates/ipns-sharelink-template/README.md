## What's IPNS?

Before introducing IPNS, it's important to understand IPFS (InterPlanetary File System). IPFS is a distributed file system used for storing and sharing files, websites, applications, and data. To share a file, users simply upload it to IPFS and obtain a CID (Content Identifier), which can be shared with others. Anyone with the CID can retrieve the file content from the network.

However, since the CID is a mapping to the file content, it can be inconvenient to share a new CID every time the content is updated. That's where IPNS comes in as a solution. IPNS allows you to point to a CID. Instead of sharing the CID directly, you can share the IPNS. If the file content is updated, the IPNS can be updated to point to the new CID, ensuring that others can always access the most up-to-date content by using the IPNS.

## What can you do with the IPNS template?

With the IPNS template, you can easily share constantly updated folders, including ongoing TV series, personal portfolios, photo albums, etc. Simply set up or enter the IPNS, and you'll have access to the corresponding files.

## How to create an IPNS quickly

1. First, upload the folder you want to share to the Bucket. Select the folder and click on 'Snapshot'.
   ![](https://markdown.4everland.store/ipns/3-1.png)
2. Switch to the 'Snapshots' tab and publish the snapshot, then copy the IPFS CID.
   ![](https://markdown.4everland.store/ipns/3-2.png)
3. Create an IPNS using the copied CID in the Gateway - IPNS Manager.
   ![](https://markdown.4everland.store/ipns/3-3.png)
   ![](https://markdown.4everland.store/ipns/3-4.png)
4. Once created, click on 'Publish' to create the IPNS for the folder. Follow the same steps if the folder's content changes: snapshot the folder, obtain the new CID, click "Publish" in IPNS, and enter the latest CID.
   ![](https://markdown.4everland.store/ipns/3-5.png)

## Configuration Guide

Input the following parameters when configuring the template

- Website name
- Avatar
- Bio
- IPNS Gateway
- IPFS Gateway
- IPNS Resources
- Display IPNS Input

![](https://markdown.4everland.store/ipns/3-6.png)
