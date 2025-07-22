import { Cursor, CursorPointer } from "@/components/ui/kibo-ui/cursor";

const KiboCursorExample = () => (
  <Cursor>
    <CursorPointer />
    <div className="min-h-screen flex flex-col items-center justify-center bg-background text-foreground">
      <h1 className="text-2xl font-bold mb-6">Kibo UI Cursor Example</h1>
      <div className="w-full max-w-lg p-8 rounded-lg bg-card border border-border shadow-lg flex flex-col items-center">
        <p className="mb-4 text-muted-foreground text-center">
          Move your mouse around this page to see the custom Kibo UI cursor in
          action.
          <br />
          (The cursor is only applied on this page.)
        </p>
        <div className="w-64 h-32 bg-muted rounded-lg flex items-center justify-center text-lg font-medium">
          Hover here!
        </div>
      </div>
    </div>
  </Cursor>
);

export default KiboCursorExample;
