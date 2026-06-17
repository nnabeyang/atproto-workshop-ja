# PDS records

OK, now let's take a look at how those records actually get written to a PDS. I've created an account you can all use to ssh to the server running my PDS, which I posted some records to as part of our last exercise.

```bash
ssh workshop@justdothings.net
```

Once you're on the server, take a look in the `/pds` directory.

```bash
cd /pds
ls
```

This is what gets installed by our reference [PDS](https://github.com/bluesky-social/pds). We won't poke around the whole thing very long, just make a couple observations. First, let's look at the `account.sqlite` database:

```bash
sqlite3 account.sqlite
```

Let's take a look at the users hosted here:

```sql
select * from actor;
```

```
did:plc:daqeimb4g5kqqjongj4s6b4p|alex.justdothings.net|2025-10-29T18:14:16.268Z|||
did:plc:lfbdlon3iuvgnrizqzvq2kjb|testuser.justdothings.net|2026-01-27T18:06:34.174Z|||
did:plc:j7gkx5yhhnvczdsrgydushhc|test-user-two.justdothings.net|2026-01-27T18:46:52.347Z|||
```

Look, it's my test users! Pretty neat.

Now let's look at the actual records per-user...