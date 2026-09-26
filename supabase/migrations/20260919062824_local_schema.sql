DROP POLICY "Enable insert for authenticated users only" ON "public"."bikes";

DROP POLICY "TEST- Enable all for all users " ON "public"."bikes";

DROP POLICY "Enable insert for authenticated users only" ON "storage"."objects";

DROP POLICY "TEST - Enable all operations for all users 1jt5ma_0" ON "storage"."objects";

DROP POLICY "TEST - Enable all operations for all users 1jt5ma_1" ON "storage"."objects";

DROP POLICY "TEST - Enable all operations for all users 1jt5ma_2" ON "storage"."objects";

DROP POLICY "TEST - Enable all operations for all users 1jt5ma_3" ON "storage"."objects";

CREATE POLICY "Enable all for authenticated users only" ON "public"."bikes"
  FOR ALL
  TO "authenticated"
  USING (true);

CREATE POLICY "Enable all for authenticated users only" ON "storage"."objects"
  FOR ALL
  TO "authenticated"
  USING (true);
