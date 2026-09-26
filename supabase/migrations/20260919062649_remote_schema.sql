SET local check_function_bodies = off;

DROP POLICY "Enable all for authenticated users only" ON "public"."bikes";

DROP POLICY "Enable all for authenticated users only" ON "storage"."objects";

CREATE POLICY "Enable insert for authenticated users only" ON "public"."bikes"
  FOR INSERT
  TO PUBLIC
  WITH CHECK (true);

CREATE POLICY "TEST- Enable all for all users " ON "public"."bikes"
  FOR ALL
  TO PUBLIC
  USING (true);

CREATE POLICY "Enable insert for authenticated users only" ON "storage"."objects"
  FOR INSERT
  TO PUBLIC
  WITH CHECK (true);

CREATE POLICY "TEST - Enable all operations for all users 1jt5ma_0" ON "storage"."objects"
  FOR DELETE
  TO PUBLIC
  USING ((bucket_id = 'bikes'::text));

CREATE POLICY "TEST - Enable all operations for all users 1jt5ma_1" ON "storage"."objects"
  FOR SELECT
  TO PUBLIC
  USING ((bucket_id = 'bikes'::text));

CREATE POLICY "TEST - Enable all operations for all users 1jt5ma_2" ON "storage"."objects"
  FOR UPDATE
  TO PUBLIC
  USING ((bucket_id = 'bikes'::text));

CREATE POLICY "TEST - Enable all operations for all users 1jt5ma_3" ON "storage"."objects"
  FOR INSERT
  TO PUBLIC
  WITH CHECK ((bucket_id = 'bikes'::text));

CREATE EVENT TRIGGER "ensure_rls"
  ON ddl_command_end
  WHEN TAG IN ('CREATE TABLE', 'CREATE TABLE AS', 'SELECT INTO')
  EXECUTE FUNCTION "public"."rls_auto_enable"();

